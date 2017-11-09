import 'reflect-metadata'

import merge = require('lodash.merge')

import * as path from 'path'
import { Platform } from 'common-locations'
import { injectable } from 'inversify'

import { Logger } from './logging'
import { FileSystem } from './io'
import { PlatformProvider } from './services'

@injectable()
export abstract class Module {
  protected readonly log: Logger
  private readonly files: FileSystem
  private readonly platform: Platform

  constructor(files: FileSystem, logger: Logger, platform: PlatformProvider) {
    this.log = logger.extend(this.name)
    this.files = files
    this.platform = platform.platform
  }

  public getConfig<T>(): Promise<T> {
    this.log.trace('app.config', this.name)
    return this.configPaths.map(async filepath => {
      if (await this.files.exists(filepath)) {
        this.log.trace('app.config.found', filepath)
        return await this.files.json<T>(filepath)
      }
      return {} as T
    }).reduce(async (previous: Promise<T>, current: Promise<T>): Promise<T> => {
      const prev = await previous
      const curr = await current
      return merge(prev, curr)
    }, Promise.resolve({} as T))
  }

  public async getConfigArray<T>(): Promise<T[]> {
    this.log.trace('app.configs', this.name)
    return this.configPaths.map(async filepath => {
      if (await this.files.exists(filepath)) {
        this.log.trace('app.configs.found', filepath)
        return await this.files.json<T[]>(filepath)
      }
      return []
    }).reduce(async (previous: Promise<T[]>, current: Promise<T[]>): Promise<T[]> => {
      const prev = await previous
      const curr = await current
      return prev.concat(curr)
    }, Promise.resolve([]))
  }

  public abstract get name(): string
  public abstract start(...args: string[]): Promise<void>
  public abstract stop(): void

  protected get configPaths(): string[] {
    const filename = `nas-${this.name}.json`
    return [
      path.join(process.cwd(), filename),
      this.platform.config.user(filename),
      this.platform.config.local(filename),
      this.platform.config.system(filename),
    ]
  }
}

export const ModuleType = Symbol('Module')
