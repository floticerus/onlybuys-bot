import { program } from 'commander'
import { boolean } from 'boolean'

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
    '-p, --private-key <value>',
    'Private key for ethereum wallet. Passing it through PRIVATE_KEY env var instead is recommended.',
    process.env.PRIVATE_KEY,
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
    '--buy-delay <value>',
    'Delay buys by this duration in seconds, possibly useful to avoid bot detection',
    process.env.BUY_DELAY ?? '0',
  )
  .option(
    '--sell-multiplier <value>',
    'When we are up this amount, attempt to sell',
    process.env.SELL_MULTIPLIER ?? '5',
  )
  .option(
    '--sell-amount <value>',
    'balance * sellAmount = amount to sell',
    process.env.SELL_AMOUNT ?? '0.5',
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
    process.env.SLIPPAGE ?? '25',
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
  .option(
    '--blocked-names',
    'Comma separated list of names to avoid buying',
    process.env.BLOCKED_NAMES ?? 'test',
  )
  .option(
    '--disable-timestamps',
    'Disables timestamps in the logs',
    boolean(process.env.DISABLE_TIMESTAMPS ?? false),
  )

program.parse(process.argv)

export interface CLIOptions {
  readonly network: string
  readonly networks: string
  readonly privateKey: string
  readonly handshakeInterval: string
  readonly buyAmount: string
  readonly sellMultiplier: string
  readonly sellAmount: string
  readonly minBalance: string
  readonly minPooledSupply: string
  readonly minLiquidity: string
  readonly maxLiquidity: string
  readonly slippage: string
  readonly gasPrice: string
  readonly gasLimit: string
  readonly blockedNames: string
  readonly disableTimestamps: boolean
}

export const options = program.opts<CLIOptions>()
