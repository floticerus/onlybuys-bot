// import { fork } from 'child_process'
import 'dotenv/config'
import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import { clis, forkCLI, CLIOptions } from './cli-runner'
import store from './store'

const { openExternal } = shell

dialog.showErrorBox = (title, content) => {
  console.error(`${title}\n${content}`)
}

const networkConfigDefaults: Record<string, CLIOptions> = {
  eth: {
    network: 'eth',
    autoStart: false,
    buyAmount: '0.0001',
    sellMultiplier: '8',
    sellAmount: '0.2',
    minLiquidity: '0.5',
    maxLiquidity: '10',
    gasPrice: '5000000000',
    gasLimit: '500000',
  },
  bsc: {
    network: 'bsc',
    autoStart: false,
    buyAmount: '0.005',
    sellMultiplier: '8',
    sellAmount: '0.2',
    minLiquidity: '0.5',
    maxLiquidity: '10',
    gasPrice: '5000000000',
    gasLimit: '500000',
  },
  metis: {
    network: 'metis',
    autoStart: false,
    buyAmount: '0.035',
    sellMultiplier: '8',
    sellAmount: '0.2',
    minLiquidity: '1',
    maxLiquidity: '25',
    gasPrice: '8000000000',
    gasLimit: '3500000',
  },
  fuse: {
    network: 'fuse',
    autoStart: false,
    buyAmount: '5',
    sellMultiplier: '8',
    sellAmount: '0.2',
    minLiquidity: '100',
    maxLiquidity: '15000',
    gasPrice: '5000000000',
    gasLimit: '500000',
  },
  fantom: {
    network: 'fantom',
    autoStart: false,
    buyAmount: '1',
    sellMultiplier: '8',
    sellAmount: '0.2',
    minLiquidity: '100',
    maxLiquidity: '8000',
    gasPrice: '5000000000',
    gasLimit: '500000',
  },
  polygon: {
    network: 'polygon',
    autoStart: false,
    buyAmount: '1',
    sellMultiplier: '8',
    sellAmount: '0.2',
    minLiquidity: '100',
    maxLiquidity: '8000',
    gasPrice: '5000000000',
    gasLimit: '500000',
  },
  avalanche: {
    network: 'avalanche',
    autoStart: false,
    buyAmount: '1',
    sellMultiplier: '8',
    sellAmount: '0.2',
    minLiquidity: '100',
    maxLiquidity: '8000',
    gasPrice: '5000000000',
    gasLimit: '500000',
  },
  moonriver: {
    network: 'moonriver',
    autoStart: false,
    buyAmount: '1',
    sellMultiplier: '8',
    sellAmount: '0.2',
    minLiquidity: '100',
    maxLiquidity: '8000',
    gasPrice: '5000000000',
    gasLimit: '500000',
  },
  moonbeam: {
    network: 'moonbeam',
    autoStart: false,
    buyAmount: '1',
    sellMultiplier: '8',
    sellAmount: '0.2',
    minLiquidity: '100',
    maxLiquidity: '8000',
    gasPrice: '5000000000',
    gasLimit: '500000',
  },
}

const networkConfig: Record<string, CLIOptions> = ((_networkConfig) => {
  for (const network of Object.keys(networkConfigDefaults)) {
    _networkConfig[network] = JSON.parse(
      store.get(
        `network.${network}`,
        JSON.stringify(networkConfigDefaults[network]),
      ) as string,
    )
  }

  return _networkConfig
})({} as Record<string, CLIOptions>)

let mainWindow: BrowserWindow | null

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// const assetsPath =
//   process.env.NODE_ENV === 'production'
//     ? process.resourcesPath
//     : app.getAppPath()

function createWindow() {
  mainWindow = new BrowserWindow({
    // icon: path.join(assetsPath, 'assets', 'icon.png'),
    width: 1100,
    height: 700,
    backgroundColor: 'black',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

async function registerListeners() {
  /**
   * This comes from bridge integration, check bridge.ts
   */
  ipcMain.on('message', (_, message) => {
    console.log(message)
  })

  mainWindow.once('ready-to-show', () => {
    Object.keys(networkConfig).forEach((network) => {
      const cli = forkCLI({ ...networkConfig[network] })

      ipcMain
        .on(`cli.${network}.connect`, () => {
          cli.connect()
        })
        .on(`cli.${network}.disconnect`, () => {
          cli.disconnect()
        })

      cli
        .on('action', ({ action, ...rest }) => {
          //
          console.log(`received action ${action}`)

          mainWindow?.webContents.send(`cli.${network}.${action}`, rest)
        })
        .on('spawn', () => {
          cli.stdout
            ?.on('data', (chunk: Buffer) => {
              // console.log('got data')
              mainWindow?.webContents.send(
                `cli.${network}.chunk`,
                chunk.toString('utf-8'),
              )
            })
            .on('error', (err) => {
              console.error(err)
              mainWindow?.webContents.send(`cli.${network}.error`, err.message)
            })

          cli.stderr
            ?.on('data', (chunk: Buffer) => {
              console.error(chunk.toString('utf-8'))
              mainWindow?.webContents.send(
                `cli.${network}.error`,
                chunk.toString('utf-8'),
              )
            })
            .on('error', (err) => {
              console.error(err)
              mainWindow?.webContents.send(`cli.${network}.error`, err.message)
            })
          mainWindow?.webContents.send(`cli.${network}.spawn`, '1')
        })
        .on('exit', () => {
          mainWindow?.webContents.send(`cli.${network}.disconnect`)
        })
    })
  })

  mainWindow.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    openExternal(url)
  })
}

app
  .on('ready', createWindow)
  .whenReady()
  .then(registerListeners)
  .catch((e) => console.error(e))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// process.on('message', ({ action, ...rest }) => {
//   //
//   console.log('got message')
//   console.log(`got message for ${action}`, ...rest)
// })
