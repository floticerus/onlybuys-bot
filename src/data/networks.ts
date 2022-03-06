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
    // is this called "Build and Build" now?
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
    // tethys
    '0x81b9FA50D5f5155Ee17817C21702C3AE4780AD09',
    // netswap
    '0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56',
  ],
  chartURL: 'https://dexscreener.com/metis/{pair}',
}

export const Fuse: NetworkData = {
  chainId: 122,
  name: 'Fuse',
  rpcURL: 'https://rpc.fuse.io/',
  explorerURL: 'https://explorer.fuse.io/',
  nativeCurrency: {
    name: 'Fuse',
    symbol: 'FUSE',
    decimals: 18,
  },
  routers: [
    // voltage
    '0xFB76e9E7d88E308aB530330eD90e84a952570319',
    // elk
    '0x9a5De8C973c2f64f0f518DE581BcC2aa2dF8A621',
    // sushiswap
    '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
  ],
  chartURL: 'https://dexscreener.com/fuse/{pair}',
}

export const Polygon: NetworkData = {
  chainId: 137,
  name: 'Polygon',
  rpcURL: 'https://polygon-rpc.com/',
  explorerURL: 'https://polygonscan.com/',
  nativeCurrency: {
    name: 'Matic',
    symbol: 'MATIC',
    decimals: 18,
  },
  routers: [
    // quickswap
    '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    // uniswap?
    // '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
    // sushiswap
    '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
  ],
  chartURL: 'https://dexscreener.com/polygon/{pair}',
}

export const network = (() => {
  switch (options.network) {
    case 'eth':
    case '1':
      return Ethereum
    case 'bsc':
    case 'bnb':
    case '56':
    default:
      return BSC
    case 'metis':
    case '1088':
      return MetisAndromeda
    case 'fuse':
    case '122':
      return Fuse
    case 'polygon':
    case 'matic':
    case '137':
      return Polygon
  }
})()
