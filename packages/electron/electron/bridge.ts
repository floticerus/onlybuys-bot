import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import store from './store'

ipcRenderer.setMaxListeners(1000)

export const api = {
  /**
   * Here you can expose functions to the renderer process
   * so they can interact with the main (electron) side
   * without security problems.
   *
   * The function below can accessed using `window.Main.sendMessage`
   */

  sendMessage: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args)
  },

  /**
   * Provide an easier way to listen to events
   */
  on: (
    channel: string,
    callback: (event: IpcRendererEvent, ...args: any[]) => void,
  ) => {
    ipcRenderer.on(channel, callback)
  },

  once: (
    channel: string,
    callback: (event: IpcRendererEvent, ...args: any[]) => void,
  ) => {
    ipcRenderer.once(channel, callback)
  },

  off: (
    channel: string,
    callback: (event: IpcRendererEvent, ...args: any[]) => void,
  ) => {
    ipcRenderer.off(channel, callback)
  },

  store: {
    get<T = unknown>(key: string, defaultValue?: T) {
      return store.get(key, defaultValue) as T
    },

    set(key: string, value: unknown) {
      store.set(key, value)
    },
  },
}

contextBridge.exposeInMainWorld('Main', api)
