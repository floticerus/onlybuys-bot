// import chalk from 'chalk'
import { options } from './cli'

export const logCache: Array<string> = []

export const log = (...args) => {
  // const _args = args
  // console.log(chalk`{cyan [${new Date().toISOString()}]:}`, ...args)
  console.log(
    ...(options.disableTimestamps
      ? args
      : [`[${new Date().toISOString()}]:`, ...args]),
  )
  // console.log(`[${new Date().toISOString()}]: ${_args.shift()}`, ..._args)
}
