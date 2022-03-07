import { program } from 'commander'

program
  .option(
    '-n, --network <value>',
    'Network to use',
    process.env.DEFAULT_NETWORK ?? 'bsc',
  )
  .option(
    '--networks <value>',
    'Comma separated list of networks to use',
    process.env.DEFAULT_NETWORKS ??
      'eth,bsc,avalanche,fantom,metis,fuse,polygon',
  )
  .option(
    '-h, --handshake-interval <value>',
    'Time between sending handshakes, to keep websocket alive',
    process.env.HANDSHAKE_INTERVAL ?? '20',
  )
  .option(
    '-b, --buy-amount <value>',
    'Amount of native coin to spend on buys',
    process.env.BUY_AMOUNT ?? '0.008',
  )
  .option(
    '--min-balance <value>',
    'Minimum balance to maintain. Do not allow buying when below.',
    process.env.MIN_BALANCE ?? '0.05',
  )
  .option(
    '--min-pooled-supply <value>',
    'Minimum % of the supply that must be pooled to consider buying',
    process.env.MIN_POOLED_SUPPLY ?? '0.45',
  )
  .option(
    '--min-liquidity <value>',
    'Minimum amount of liquidity for buy target',
    process.env.MIN_LIQUIDITY ?? '0.25',
  )
  .option(
    '--max-liquidity <value>',
    'Maximum amount of liquidity for buy target',
    process.env.MAX_LIQUIDITY ?? '2',
  )
  .option(
    '-s, --slippage <value>',
    'Amount of slippage to use when buying',
    process.env.SLIPPAGE ?? '20',
  )
  .option(
    '--gas-price <value>',
    'Gas price to use for buys',
    process.env.GAS_PRICE ?? '5000000000', // 5 gwei
  )
  .option(
    '--gas-limit <value>',
    'Gas limit to use for buys',
    process.env.GAS_LIMIT ?? '500000',
  )

program.parse(process.argv)

export interface CLIOptions {
  network: string
  networks: string
  handshakeInterval: string
  buyAmount: string
  minBalance: string
  minPooledSupply: string
  minLiquidity: string
  maxLiquidity: string
  slippage: string
  gasPrice: string
  gasLimit: string
}

export const options = program.opts<CLIOptions>()
