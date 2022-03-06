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
}

export const BSC: NetworkData = {
  chainId: 56,
  name: 'BSC',
  rpcURL: 'https://bsc-dataseed.binance.org',
  websocketURL: 'wss://bsc-ws-node.nariox.org:443',
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
}
