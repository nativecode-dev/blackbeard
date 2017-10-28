import 'reflect-metadata'

import * as process from 'process'
import { injectable } from 'inversify'
import { Logger } from './Logger'
import { LoggerFactory } from './LoggerFactory'

@injectable()
export class Variables {
  private readonly env: NodeJS.ProcessEnv
  private readonly log: Logger

  constructor(logger: LoggerFactory) {
    this.env = process.env
    this.log = logger.create('service:variables')
  }

  public get(name: string, defaultValue: string = '', fixcase: boolean = true): string {
    const key = fixcase ? name.toUpperCase() : name
    if (this.env[key]) {
      const value = this.env[key]
      this.log.trace(`reading variable ${name} from env: ${value}`)
      return value || defaultValue
    }
    this.log.trace(`reading variable ${name} from default value: ${defaultValue}`)
    return defaultValue
  }
}
