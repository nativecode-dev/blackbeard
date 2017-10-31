import 'reflect-metadata'

import * as path from 'path'
import { inject, injectable } from 'inversify'
import { FileSystem } from './FileSystem'
import { Logger, LoggerType } from './logging'

const ConfigCache: { [key: string]: any } = {}

@injectable()
export class Config {
  private readonly files: FileSystem
  private readonly initialized: Promise<string>
  private readonly log: Logger

  constructor(files: FileSystem, @inject(LoggerType) logger: Logger) {
    this.files = files
    this.log = logger.extend('config')
    this.initialized = this.init()
  }

  public get appname(): string {
    return 'blackbeard'
  }

  public async exists(filename: string): Promise<boolean> {
    const rootpath = await this.initialized
    const filepath = path.join(rootpath, filename)
    return this.files.exists(filepath)
  }

  public async load<T>(filename: string): Promise<T> {
    const rootpath = await this.initialized
    const key = filename.toLowerCase()
    if (ConfigCache[key]) {
      this.log.trace(`returning cached instance for "${filename}"`)
      return ConfigCache[key]
    }
    const filepath = path.join(rootpath, filename)
    this.log.trace(`loading config from ${filepath}`)
    return ConfigCache[key] = await this.files.json<T>(filepath)
  }

  public async save<T>(config: T, filename: string): Promise<void> {
    const rootpath = await this.initialized
    const key = filename.toLowerCase()
    ConfigCache[key] = config

    const buffer = new Buffer(JSON.stringify(config))
    const filepath = path.join(rootpath, filename)
    this.log.trace(`saving "${filename}"`)
    await this.files.fileWrite(filepath, buffer)
  }

  private async init(): Promise<string> {
    if (process.env.BLACKBEARD_PATH_CONFIG) {
      return process.env.BLACKBEARD_PATH_CONFIG as string
    }

    const configpath = path.join(process.cwd(), 'config')
    if (await this.files.exists(configpath)) {
      return configpath
    }

    return process.cwd()
  }
}
