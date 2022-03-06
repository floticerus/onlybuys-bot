// import chalk from 'chalk'

export const log = (...args) => {
  // const _args = args
  // console.log(chalk`{cyan [${new Date().toISOString()}]:}`, ...args)
  console.log(`[${new Date().toISOString()}]:`, ...args)
  // console.log(`[${new Date().toISOString()}]: ${_args.shift()}`, ..._args)
}
