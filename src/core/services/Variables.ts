import 'reflect-metadata'

import * as process from 'process'
import { inject, injectable } from 'inversify'

import { Config } from '../configuration'
import { Logger, LoggerType } from '../logging'

interface ConfigFile {
  env: NodeJS.ProcessEnv,
  settings: {
    cache: string,
    scheduler: string
  }
}

export const Converters = {
  date: (...args: any[]) => new Date(...args),
  bool: (value: any) => Boolean(value),
  num: (value: any) => Number(value),
  str: (value: any) => String(value),
}

@injectable()
export class Variables {
  private readonly config: Config
  private readonly initialized: Promise<NodeJS.ProcessEnv>
  private readonly log: Logger

  constructor(config: Config, @inject(LoggerType) logger: Logger) {
    this.config = config
    this.initialized = this.init()
    this.log = logger.extend('variables')
  }

  public async as<T>(name: string, defaultValue: T, converter: any) {
    const value = await this.get(name, defaultValue.toString())
    return converter(value) as T
  }

  public async get(name: string, defaultValue: string = '', fixcase: boolean = true): Promise<string> {
    const env = await this.initialized
    const key = fixcase ? name.toUpperCase() : name
    if (env[key]) {
      const value = env[key]
      this.log.trace(`reading variable ${name} from env: ${value}`)
      return value || defaultValue
    }
    this.log.trace(`reading variable ${name} from default value: ${defaultValue}`)
    return defaultValue
  }

  private async init(): Promise<NodeJS.ProcessEnv> {
    if (await this.config.exists('nas-config.json')) {
      const config = await this.config.load<ConfigFile>('nas-config.json')
      return Object.assign(config.env, process.env)
    }
    return process.env
  }
}
