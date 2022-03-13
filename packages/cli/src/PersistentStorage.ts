import { join } from 'path'
import { readdir, readFile, writeFile, rm, rename, mkdirSync } from 'fs'
import { promisify } from 'util'

const readdirAsync = promisify(readdir)
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)
const rmAsync = promisify(rm)
const renameAsync = promisify(rename)

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

export interface SetJSONOptions {
  shallowMerge?: boolean
}

export default class PersistentStorage {
  constructor({ dir }: PersistentStorageOptions) {
    this.dir = dir ?? DEFAULT_DATA_DIR

    // make sure `dir` exists
    try {
      mkdirSync(this.dir, { recursive: true })
    } catch (err) {
      //
    }
  }

  readonly dir: string

  async getItem(key: string): Promise<string | undefined> {
    return (await readFileAsync(join(this.dir, key))).toString('utf-8')
  }

  async setItem(key: string, value: string) {
    await writeFileAsync(join(this.dir, key), value, { encoding: 'utf-8' })
  }

  async deleteItem(key: string) {
    await rmAsync(join(this.dir, key))
  }

  async hideItem(key: string) {
    await renameAsync(join(this.dir, key), join(this.dir, `.${key}`))
  }

  async showItem(key: string) {
    await renameAsync(join(this.dir, `.${key}`), join(this.dir, key))
  }

  async getJSON<T = object>(key: string): Promise<T | undefined> {
    return JSON.parse(await this.getItem(key)) as T | undefined
  }

  async setJSON<T = object>(
    key: string,
    value: T,
    { shallowMerge = false }: SetJSONOptions = {},
  ) {
    await this.setItem(
      key,
      JSON.stringify(
        shallowMerge ? { ...(await this.getJSON<T>(key)), ...value } : value,
      ),
    )
  }

  async getAllFiles() {
    return await readdirAsync(this.dir)
  }

  async getKeys() {
    // .DS_Store file winds up in this folder - we should be able omit all files starting with .
    // this might someday not be a good solution, but for now it works.
    return (await this.getAllFiles()).filter((v) => !v.startsWith('.'))
  }

  async getHiddenKeys() {
    return (await this.getAllFiles()).filter(
      (v) => v.startsWith('.') && !v.startsWith('.DS_Store'),
    )
  }
}
