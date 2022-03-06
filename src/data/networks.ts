import { options } from '../cli'
import { NetworkData } from '../typings'

export const Ethereum: NetworkData = {
  chainId: 1,
  name: 'Ethereum',
  rpcURL: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
  websocketURL: `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_ID}`,
  explorerURL: 'https://etherscan.io',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  routers: [
    // uniswap v2
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  ],
  chartURL: 'https://dexscreener.com/ethereum/{pair}',
}

export const BSC: NetworkData = {
  chainId: 56,
  name: 'BSC',
  rpcURL: 'https://bsc-dataseed.binance.org',
  // websocketURL: 'wss://bsc-ws-node.nariox.org:443',
  explorerURL: 'https://bscscan.com',
  nativeCurrency: {
    name: 'Binance Coin',
    symbol: 'BNB',
    decimals: 18,
  },
  routers: [
    // pancakeswap v2
    '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  ],
  // chartURL: 'https://dexscreener.com/bsc/{pair}',
  chartURL: 'https://poocoin.app/tokens/{token}',
}

export const MetisAndromeda: NetworkData = {
  chainId: 1088,
  name: 'Metis Andromeda',
  rpcURL: 'https://andromeda.metis.io/?owner=1088',
  explorerURL: 'https://andromeda-explorer.metis.io/',
  nativeCurrency: {
    name: 'Metis',
    symbol: 'METIS',
    decimals: 18,
  },
  routers: [
    // idk what this one is?? tethys?
    '0x81b9FA50D5f5155Ee17817C21702C3AE4780AD09',
    // netswap
    '0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56',
  ],
  chartURL: 'https://dexscreener.com/metis/{pair}',
}

export const network = (() => {
  switch (options.network) {
    case 'eth':
    case '1':
      return Ethereum
    case 'bsc':
    case '56':
    default:
      return BSC
    case 'metis':
    case '1088':
      return MetisAndromeda
  }
})()
