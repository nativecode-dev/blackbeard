import 'reflect-metadata'

import * as path from 'path'
import { injectable } from 'inversify'
import { FileSystem } from './FileSystem'
import { Logger } from './Logger'
import { LoggerFactory } from './LoggerFactory'

@injectable()
export class Config {
  private readonly cache: { [key: string]: any }
  private readonly files: FileSystem
  private readonly initialized: Promise<string>
  private readonly log: Logger

  constructor(files: FileSystem, logger: LoggerFactory) {
    this.cache = {}
    this.files = files
    this.log = logger.create('service:config')
    this.initialized = this.init()
  }

  public async exists(filename: string): Promise<boolean> {
    const rootpath = await this.initialized
    const filepath = path.join(rootpath, filename)
    return this.files.exists(filepath)
  }

  public async load<T>(filename: string): Promise<T> {
    const rootpath = await this.initialized
    const key = filename.toLowerCase()
    if (this.cache[key]) {
      this.log.trace(`return cached instances for ${filename}`)
      return this.cache[key]
    }
    const filepath = path.join(rootpath, filename)
    this.log.trace(`loading ${filename}`)
    return this.cache[key] = await this.files.json<T>(filepath)
  }

  public async save<T>(config: T, filename: string): Promise<void> {
    const rootpath = await this.initialized
    const key = filename.toLowerCase()
    this.cache[key] = config

    const buffer = new Buffer(JSON.stringify(config))
    const filepath = path.join(rootpath, filename)
    this.log.trace(`saving ${filename}`)
    await this.files.fileWrite(filepath, buffer)
  }

  private async init(): Promise<string> {
    if (process.env.NAS_DATAPATH) {
      return process.env.NAS_DATAPATH as string
    }

    const configpath = path.join(process.cwd(), 'config')
    if (await this.files.exists(configpath) === false) {
      return process.cwd()
    }

    return configpath
  }
}
