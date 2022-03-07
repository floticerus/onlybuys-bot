export interface TokenData {
  readonly address?: string
  readonly name: string
  readonly symbol: string
  readonly decimals: number
}

export interface NetworkData {
  readonly chainId: number
  readonly name: string
  readonly nativeCurrency: TokenData
  readonly icon?: string
  readonly rpcURL: string
  readonly websocketURL?: string
  readonly explorerURL: string
  readonly routers: Array<string>
  readonly chartURLs: Array<string>
}

export interface PortfolioTokenData {
  readonly router: string
  readonly address: string
  readonly name: string
  readonly symbol: string
  readonly decimals: number
  readonly totalSupply: string
  readonly balance: string
  readonly pair: string
  value?: number
}
