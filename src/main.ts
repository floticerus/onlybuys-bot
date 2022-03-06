import 'dotenv/config'
import { options } from './cli'
import * as networks from './data/networks'
import { log } from './logger'
import { providers, Wallet, Contract, utils, BigNumber } from 'ethers'
import UniswapV2Router02 from './data/abis/UniswapV2Router02'
import UniswapV2Factory from './data/abis/UniswapV2Factory'
import UniswapV2Pair from './data/abis/UniswapV2Pair'
import ERC20 from './data/abis/ERC20'

const { WebSocketProvider, JsonRpcProvider } = providers
const { fromMnemonic } = Wallet
const { formatEther, formatUnits, parseEther, commify } = utils

export const network = (() => {
  switch (options.network) {
    case 'eth':
    case '1':
      return networks.Ethereum
    case 'bsc':
    case '56':
    default:
      return networks.BSC
  }
})()

export let provider: providers.WebSocketProvider | providers.JsonRpcProvider
export let wallet: Wallet
;(async () => {
  // prefer to use websocket provider, use http rpc provider as fallback
  provider = network.websocketURL
    ? new WebSocketProvider(network.websocketURL, network)
    : new JsonRpcProvider(network.rpcURL, network)

  wallet = new Wallet(fromMnemonic(process.env.MNEMONIC).privateKey, provider)

  setInterval(() => {
    log('Sending handshake...')
    wallet.getBalance().catch(console.error)
  }, parseInt(options.handshakeInterval) * 1000)

  log(`Connecting to ${network.name} with wallet: ${wallet.address}`)

  log(
    `${network.nativeCurrency.symbol} balance: ${commify(
      formatEther(await wallet.getBalance()),
    )}`,
  )

  network.routers.forEach(async (routerAddress) => {
    log(`Configuring router at ${routerAddress}`)

    //
    const router = new Contract(routerAddress, UniswapV2Router02, wallet)

    const weth = new Contract(await router.WETH(), ERC20, provider)

    log(`Wrapped native token: ${await weth.symbol()}, ${weth.address}`)

    const factory = new Contract(
      await router.factory(),
      UniswapV2Factory,
      provider,
    )

    log(`Watching factory at ${factory.address}`)

    factory.on(
      'PairCreated',
      async (token0Address, token1Address, pairAddress) => {
        const pair = new Contract(pairAddress, UniswapV2Pair, provider)
        const token0 = new Contract(token0Address, ERC20, wallet)
        const token1 = new Contract(token1Address, ERC20, wallet)

        const [name0, name1, symbol0, symbol1, decimals0, decimals1] =
          await Promise.all([
            token0.name() as Promise<string>,
            token1.name() as Promise<string>,
            token0.symbol() as Promise<string>,
            token1.symbol() as Promise<string>,
            token0.decimals() as Promise<number>,
            token1.decimals() as Promise<number>,
          ])

        let totalSupply0: BigNumber, totalSupply1: BigNumber
        let balance0: BigNumber, balance1: BigNumber
        let pooledPercent0 = 0,
          pooledPercent1 = 0

        const updateBalances = async () => {
          ;[totalSupply0, totalSupply1, balance0, balance1] = await Promise.all(
            [
              token0.totalSupply() as Promise<BigNumber>,
              token1.totalSupply() as Promise<BigNumber>,
              token0.balanceOf(pairAddress) as Promise<BigNumber>,
              token1.balanceOf(pairAddress) as Promise<BigNumber>,
            ],
          )

          pooledPercent0 =
            parseFloat(balance0.mul(10000).div(totalSupply0).toString()) *
            0.0001
          pooledPercent1 =
            parseFloat(balance1.mul(10000).div(totalSupply1).toString()) *
            0.0001
        }

        await updateBalances()

        const logPair = (prefix?: string) => {
          log(`${prefix || ''}
  address: ${pairAddress}
  router: ${routerAddress}
  token0:
    name: ${name0} (${symbol0})
    address: ${token0Address}
    total supply: ${commify(formatUnits(totalSupply0, decimals0))}
    pooled: ${commify(formatUnits(balance0, decimals0))} (${
            pooledPercent0 * 100
          }%)
  token1:
    name: ${name1} (${symbol1})
    address: ${token1Address}
    total supply: ${commify(formatUnits(totalSupply1, decimals1))}
    pooled: ${commify(formatUnits(balance1, decimals1))} (${
            pooledPercent1 * 100
          }%)`)
        }

        logPair('Pair created')

        // determine if we should track
        const validTokenForTrade =
          token0Address === weth.address
            ? token1
            : token1Address === weth.address
            ? token0
            : undefined

        if (!validTokenForTrade) return

        const is0 = token0Address === validTokenForTrade.address

        log(
          `Can buy ${is0 ? symbol0 : symbol1} with ${
            network.nativeCurrency.symbol
          }`,
        )

        const buy = async () => {
          log(
            `Buy ${options.buyAmount} ${
              network.nativeCurrency.symbol
            } worth of ${is0 ? symbol0 : symbol1}`,
          )

          // get a quote
          const quote: BigNumber = await router.quote(
            parseEther(options.buyAmount),
            is0 ? balance1 : balance0,
            is0 ? balance0 : balance1,
          )

          log(
            'Quoted buy amount: ',
            formatUnits(quote, is0 ? decimals0 : decimals1),
          )

          const minimumAmountToBuy = quote
            .mul(100 - parseInt(options.slippage))
            .div(100)

          log(
            `Minimum amount of ${
              is0 ? symbol0 : symbol1
            } to receive: ${formatUnits(
              minimumAmountToBuy,
              is0 ? decimals0 : decimals1,
            )}`,
          )

          // make the buy
          try {
            await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
              minimumAmountToBuy,
              [
                is0 ? token1Address : token0Address,
                is0 ? token0Address : token1Address,
              ],
              wallet.address,
              BigNumber.from(Math.floor(Date.now() / 1000) + 20),
              {
                value: parseEther(options.buyAmount),
                gasPrice: BigNumber.from(options.gasPrice),
                gasLimit: BigNumber.from(options.gasLimit),
              },
            )
          } catch (err) {
            log(`Transaction error: ${err.message ?? 'Unknown error'}`)
          }
        }

        const shouldBuy = async () => {
          const hasEnoughPooled =
            (is0 ? pooledPercent0 : pooledPercent1) >=
            parseFloat(options.minPooledSupply)

          if (!hasEnoughPooled) {
            log('Does not have enough pooled tokens to buy')
            return false
          }

          const balance = await wallet.getBalance()

          if (balance.lte(parseEther(options.minBalance))) {
            log(`Current balance of ${formatEther(balance)} is too low to buy`)
            return false
          }

          log('Has enough pooled tokens to buy!')

          if (
            (is0 ? balance1 : balance0).lt(parseEther(options.minLiquidity)) ||
            (is0 ? balance1 : balance0).gt(parseEther(options.maxLiquidity))
          ) {
            log(
              `Liquidity of ${formatEther(
                is0 ? balance1 : balance0,
              )} is not in the target range: ${options.minLiquidity} - ${
                options.maxLiquidity
              }`,
            )

            return false
          }

          log('Liquidity is within buy range!')

          return true
        }

        ;(await shouldBuy()) && (await buy())

        pair.once('Mint', async (/*data*/) => {
          await updateBalances()
          logPair(`Pair ${pair.address} minted`)
          ;(await shouldBuy()) && (await buy())
        })
      },
    )
  })
})()
