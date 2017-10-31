import 'reflect-metadata'

import * as path from 'path'
import { Platform } from 'common-locations'
import { injectable } from 'inversify'
import { Logger } from './logging'
import { FileSystem } from './FileSystem'
import { PlatformProvider } from './PlatformProvider'
import merge = require('lodash.merge')

@injectable()
export abstract class App {
  protected readonly log: Logger
  private readonly files: FileSystem
  private readonly platform: Platform

  constructor(files: FileSystem, logger: Logger, platform: PlatformProvider) {
    this.log = logger.extend(this.name)
    this.files = files
    this.platform = platform.platform
  }

  public config<T>(name: string): Promise<T> {
    this.log.trace('app.config', name)
    return this.filepaths(name)
      .map(async filepath => {
        if (await this.files.exists(filepath)) {
          this.log.trace('app.config.found', filepath)
          return await this.files.json<T>(filepath)
        }
        return {} as T
      })
      .reduce(async (previous: Promise<T>, current: Promise<T>): Promise<T> => {
        const prev = await previous
        const curr = await current
        return merge(prev, curr)
      }, Promise.resolve({} as T))
  }

  public async configs<T>(name: string): Promise<T[]> {
    this.log.trace('app.configs', name)
    return this.filepaths(name)
      .map(async filepath => {
        if (await this.files.exists(filepath)) {
          this.log.trace('app.configs.found', filepath)
          return await this.files.json<T[]>(filepath)
        }
        return []
      })
      .reduce(async (previous: Promise<T[]>, current: Promise<T[]>): Promise<T[]> => {
        const prev = await previous
        const curr = await current
        return prev.concat(curr)
      }, Promise.resolve([]))
  }

  public abstract start(...args: string[]): Promise<void>
  protected abstract get name(): string

  private filepaths(name: string): string[] {
    const filename = `nas-${name}.json`
    return [
      path.join(process.cwd(), filename),
      this.platform.config.user(filename),
      this.platform.config.local(filename),
      this.platform.config.system(filename),
    ]
  }
}
