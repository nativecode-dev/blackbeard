import 'reflect-metadata'

import * as path from 'path'
import { injectable } from 'inversify'
import { FileSystem } from './FileSystem'

@injectable()
export class Config {
  private readonly cache: { [key: string]: any }
  private readonly files: FileSystem
  private readonly rootpath: string

  constructor(files: FileSystem) {
    this.files = files
    this.rootpath = process.env.NAS_DATAPATH || path.join(process.cwd(), 'config')
  }

  public async load<T>(filename: string): Promise<T> {
    const key = filename.toLowerCase()
    if (this.cache[key]) {
      return this.cache[key]
    }
    const filepath = path.join(this.rootpath, filename)
    return this.cache[key] = await this.files.json<T>(filepath)
  }

  public save<T>(config: T, filename: string): Promise<void> {
    const key = filename.toLowerCase()
    this.cache[key] = config

    const buffer = new Buffer(JSON.stringify(config))
    const filepath = path.join(this.rootpath, filename)
    return this.files.fileWrite(filepath, buffer)
  }
}
