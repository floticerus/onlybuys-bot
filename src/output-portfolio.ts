import 'dotenv/config'
import { join } from 'path'
import { readdir, readFile } from 'fs'
import { promisify } from 'util'
import { Contract, utils } from 'ethers'
import { network } from './data/networks'
import portfolioStorage, { updatePortfolio } from './portfolioStorage'
import { PortfolioTokenData } from './typings'
import { provider } from './common'
import UniswapV2Router02 from './data/abis/UniswapV2Router02'
import ERC20 from './data/abis/ERC20'

const readdirAsync = promisify(readdir)
const readFileAsync = promisify(readFile)

const { commify, formatEther, parseUnits } = utils

console.log(`
-----------------------------
-**** Viewing portfolio ****-
-----------------------------
`)

//
;(async () => {
  await updatePortfolio()
  ;(await readdirAsync(portfolioStorage.dir)).forEach(async (file) => {
    if (!file.startsWith('0x')) return

    const {
      router: routerAddress,
      address,
      pair: pairAddress,
      name,
      symbol,
      balance,
      decimals,
    }: PortfolioTokenData = JSON.parse(
      (await readFileAsync(join(portfolioStorage.dir, file))).toString('utf-8'),
    )

    const router = new Contract(
      routerAddress ?? network.routers[0],
      UniswapV2Router02,
      provider,
    )

    const token = new Contract(address, ERC20, provider)
    const paired = new Contract(
      await (network.chainId === 1088 &&
      routerAddress === '0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56'
        ? router.Metis()
        : routerAddress === '0x60aE616a2155Ee3d9A68541Ba4544862310933d4'
        ? router.WAVAX()
        : router.WETH()),
      ERC20,
      provider,
    )

    const [tokenBalance, pairBalance] = await Promise.all([
      token.balanceOf(pairAddress),
      paired.balanceOf(pairAddress),
    ])

    console.log(`
${name} (${symbol})
Address: ${address}
Chart: ${network.chartURL
      .replace('{pair}', pairAddress)
      .replace('{token}', address)}
Balance: ${commify(balance)}
Value: ${formatEther(
      await router.quote(
        parseUnits(balance, decimals),
        tokenBalance,
        pairBalance,
      ),
    )} ${network.nativeCurrency.symbol}

-----------------------------`)
  })
})()
