import { options } from './cli'
import { network } from './data/networks'
import { getWethFunctionForRouter, provider, wallet } from './common'
import { Contract, utils, BigNumber } from 'ethers'
import ERC20 from './data/abis/ERC20'
import UniswapV2Router02 from './data/abis/UniswapV2Router02'
import UniswapV2Pair from './data/abis/UniswapV2Pair'
import portfolioStorage from './portfolioStorage'
import { PortfolioTokenData } from './typings'
import { log } from './logger'

const { parseUnits, parseEther, formatEther, formatUnits } = utils

const sellTimers: Record<string, number> = {}

export const maybeSell = async (tokenAddress: string) => {
  // 5 minute sell timer - move to config
  if (
    sellTimers[tokenAddress] &&
    Date.now() - sellTimers[tokenAddress] < 1000 * 60 * 3
  ) {
    return
  }

  const tokenData = await portfolioStorage.getJSON<PortfolioTokenData>(
    tokenAddress,
  )

  const router = new Contract(
    tokenData.router || network.routers[0],
    UniswapV2Router02,
    wallet,
  )
  const token = new Contract(tokenData.address, ERC20, wallet)
  const wethAddress = await router[
    getWethFunctionForRouter(tokenData.router || network.routers[0])
  ]()
  const pairedWith = new Contract(wethAddress, ERC20, provider)

  const [tokenBalance, pairedBalance] = await Promise.all([
    token.balanceOf(tokenData.pair),
    pairedWith.balanceOf(tokenData.pair),
  ])

  const myBalance = await token.balanceOf(wallet.address) // parseUnits(tokenData.balance, tokenData.decimals)

  const currentValue: BigNumber = await router.quote(
    myBalance,
    tokenBalance,
    pairedBalance,
  )

  log(`Swap detected on ${tokenData.symbol} (${tokenData.address})
Balance: ${tokenData.balance}
Paid: ${tokenData.paid || options.buyAmount} ${network.nativeCurrency.symbol}
Sold: ${tokenData.sold ?? '0.0'}
Current value: ${formatEther(currentValue)} ${network.nativeCurrency.symbol}
Charts: ${network.chartURLs.map(
    (chartURL) => `
  - ${chartURL
    .replace('{pair}', tokenData.pair)
    .replace('{token}', tokenData.address)}`,
  )}
`)

  const paidValue = parseEther(tokenData.paid || options.buyAmount)

  if (currentValue.gte(paidValue.mul(options.sellMultiplier))) {
    console.log(
      `${tokenData.symbol} is up at least ${options.sellMultiplier}x, sell ${
        parseFloat(options.sellAmount) * 100
      }%`,
    )

    sellTimers[tokenAddress] = Date.now()

    const sellAmount = myBalance
      .mul(100)
      .div(Math.floor(parseFloat(options.sellAmount) * 100))

    if (
      (
        await token.allowance(
          wallet.address,
          tokenData.router || network.routers[0],
        )
      ).lt(sellAmount)
    ) {
      // infinite allowance so we don't have to keep approving
      await (
        await token.approve(
          tokenData.router || network.routers[0],
          parseUnits(tokenData.totalSupply, tokenData.decimals),
        )
      ).wait()

      // we need to check if we still don't have approval -
      // otherwise it will keep executing and wasting gas
      if (
        (
          await token.allowance(
            wallet.address,
            tokenData.router || network.routers[0],
          )
        ).lt(sellAmount)
      ) {
        //
        portfolioStorage.hideItem(tokenAddress)
        return
      }
    }

    log('Make swap')

    let didSell = false

    try {
      await (
        await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
          sellAmount,
          currentValue.div(4),
          [tokenData.address, wethAddress],
          wallet.address,
          // 2 minute deadline
          BigNumber.from(Math.floor(Date.now() / 1000 + 120)),
        )
      ).wait()

      didSell = true
    } catch (err) {
      log(err.message)
    }

    if (didSell) {
      await portfolioStorage.setJSON<PortfolioTokenData>(tokenAddress, {
        ...tokenData,
        balance: formatUnits(
          await token.balanceOf(wallet.address),
          tokenData.decimals,
        ),
      })
    }
  }
}

export const maybeSellAll = async () => {
  ;(await portfolioStorage.getKeys()).forEach(async (tokenAddress) => {
    try {
      await maybeSell(tokenAddress)
    } catch (err) {
      log(err.message)
    }
  })
}

export const watch = async (tokenAddress: string) => {
  //
  const tokenData = await portfolioStorage.getJSON<PortfolioTokenData>(
    tokenAddress,
  )

  if (!tokenData) return

  const pair = new Contract(tokenData.pair, UniswapV2Pair, provider)

  pair.on('Swap', () => maybeSell(tokenAddress))

  log(`Watching ${tokenData.symbol}`)
}

export const watchAll = async () => {
  //
  ;(await portfolioStorage.getKeys()).forEach(async (tokenAddress) => {
    try {
      // await maybeSell(tokenAddress)
      await watch(tokenAddress)
    } catch (err) {
      log(err.message)
    }
  })
}
