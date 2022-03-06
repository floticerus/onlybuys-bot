import { join } from 'path'
import { readdir } from 'fs'
import { promisify } from 'util'
import { network } from './data/networks'
import PersistentStorage, { DEFAULT_DATA_DIR } from './PersistentStorage'
import { provider, wallet } from './common'
import ERC20 from './data/abis/ERC20'
import { Contract, utils } from 'ethers'
import { PortfolioTokenData } from './typings'

const readdirAsync = promisify(readdir)

const { formatUnits } = utils

const storage = new PersistentStorage({
  dir: join(DEFAULT_DATA_DIR, 'portfolio', network.name),
})

export default storage

export const updatePortfolio = async () => {
  const tokens = (await readdirAsync(storage.dir)).filter((v) =>
    v.startsWith('0x'),
  )

  await Promise.all(
    tokens.map((tokenAddress) =>
      (async () => {
        const existing = await storage.getJSON<PortfolioTokenData>(tokenAddress)

        const token = new Contract(tokenAddress, ERC20, provider)

        await storage.setJSON<PortfolioTokenData>(tokenAddress, {
          ...existing,
          balance: formatUnits(
            await token.balanceOf(wallet.address),
            existing.decimals,
          ),
        })
      })(),
    ),
  )
}
