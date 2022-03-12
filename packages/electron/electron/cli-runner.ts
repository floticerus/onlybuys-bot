import { join } from 'path'
import { EventEmitter } from 'events'
import { fork, ChildProcess } from 'child_process'
import AbortController from 'abort-controller'
import store from './store'

export interface CLIOptions {
  network: string
  autoStart: boolean
  buyAmount: string
  sellMultiplier: string
  sellAmount: string
  minLiquidity: string
  maxLiquidity: string
  gasPrice: string
  gasLimit: string
}

export interface ActionMessage {
  action: string
}

export function isActionMessage(message: any): message is ActionMessage {
  return message?.hasOwnProperty('action') ? true : false
}

export class CLIWrapper extends EventEmitter {
  constructor({ ...options }: CLIOptions) {
    super()
    this.setMaxListeners(1000)

    this.options = { ...options }

    // this._abortController = new AbortController()

    if (this.options.autoStart) {
      this.forkCLI()
    }
  }

  readonly options: CLIOptions

  private _instance?: ChildProcess

  private _abortController: AbortController

  // get abortController() {
  //   return this._abortController
  // }

  get instance() {
    return this._instance
  }

  get stdio() {
    return this._instance?.stdio
  }

  get stdin() {
    return this.instance?.stdin
  }

  get stdout() {
    return this._instance?.stdout
  }

  get stderr() {
    return this._instance?.stderr
  }

  connect() {
    if (!this._instance) {
      this.forkCLI()
    }
  }

  disconnect() {
    if (this._instance) {
      // this._abortController.abort()
      this._instance.kill('SIGINT')
    }
  }

  /** forward emits to the ChildProcess instance? */
  emit(eventName: string | symbol, ...args: any[]) {
    this._instance?.emit(eventName, ...args)
    return super.emit(eventName, ...args)
  }

  forkCLI() {
    // const { signal } = this._abortController

    this._instance = fork(
      join(
        __dirname,
        '../',
        '../',
        'node_modules',
        '@onlybuys-bot',
        'cli',
        'build',
        'bundle',
      ),
      [
        `--network=${this.options.network}`,
        `--buy-amount=${this.options.buyAmount}`,
        `--sell-multiplier=${this.options.sellMultiplier}`,
        `--sell-amount=${this.options.sellAmount}`,
        `--min-liquidity=${this.options.minLiquidity}`,
        `--max-liquidity=${this.options.maxLiquidity}`,
        `--gas-price=${this.options.gasPrice}`,
        `--gas-limit=${this.options.gasLimit}`,
        '--disable-timestamps',
      ],
      {
        // signal,
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'], // 'pipe',
        silent: true,
        env: {
          ...process.env,
          INFURA_ID: '9aa3d95b3bc440fa88ea12eaa4456161',
          PRIVATE_KEY: store.get('privatekey') as string,
        },
      },
    )

    setImmediate(() => this.emit('spawn'))

    this._instance
      .on('close', (...args) => this.emit('close', ...args))
      .on('disconnect', () => this.emit('disconnect'))
      .on('error', (err) => this.emit('error', err))
      .on('exit', (...args) => {
        this._instance = undefined
        this.emit('exit', ...args)
      })
      .on(
        'message',
        (message: any) => {
          // console.log(
          //   `${this.options.network} client sent action: ${message.action}`,
          // )
          if (isActionMessage(message)) {
            this.emit('action', message)
          }
        },
        // this.emit('message', message, sendHandle),
      )
    // .on('spawn', () => {
    //   setImmediate(() => this.emit('spawn'))
    // })

    if (this.options.autoStart) {
      this._instance.on('exit', () => setTimeout(() => this.forkCLI(), 2000))
    }

    return this._instance
  }
}

export const clis: Record<string, CLIWrapper> = {}

export const forkCLI = (options: CLIOptions) => {
  if (clis[options.network]) {
    throw new Error(`CLI for the network '${options.network}' already exists`)
  }

  const cli = new CLIWrapper(options)
  clis[options.network] = cli

  return cli
}
