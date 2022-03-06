import { join } from 'path'
import { readFile, writeFile, mkdirSync } from 'fs'
import { promisify } from 'util'

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

export const DEFAULT_DATA_DIR = join(
  process.env.APPDATA ||
    (process.platform == 'darwin'
      ? process.env.HOME + '/Library/Preferences'
      : process.env.HOME + '/.local/share'),
  'onlybuys-bot',
)

export interface PersistentStorageOptions {
  dir?: string
}

export default class PersistentStorage {
  constructor({ dir }: PersistentStorageOptions) {
    this.dir = dir

    // make sure `dir` exists
    try {
      mkdirSync(this.dir)
    } catch (err) {
      //
    }
  }

  readonly dir: string = DEFAULT_DATA_DIR

  async getItem(key: string): Promise<string | undefined> {
    return (await readFileAsync(join(this.dir, key))).toString('utf-8')
  }

  async setItem(key: string, value: string) {
    await writeFileAsync(join(this.dir, key), value, { encoding: 'utf-8' })
  }

  async getJSON<T = object>(key: string): Promise<T | undefined> {
    return JSON.parse(await this.getItem(key)) as T | undefined
  }

  async setJSON<T = object>(key: string, value: T) {
    this.setItem(key, JSON.stringify(value))
  }
}
