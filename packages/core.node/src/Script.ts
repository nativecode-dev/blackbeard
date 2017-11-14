import 'reflect-metadata'

import * as throttle from 'async-throttle'
import * as os from 'os'
import { Logger, LoggerType } from '@beard/core'
import { inject, injectable } from 'inversify'

@injectable()
export abstract class Script {
  private readonly logger: Logger
  private readonly throttler: (callback: () => Promise<any>) => Promise<any>

  constructor( @inject(LoggerType) logger: Logger) {
    const max = os.cpus().length
    this.logger = logger.extend(this.name)
    this.throttler = throttle(max)
    this.logger.trace(`throttling set to ${max}`)
  }

  public start(...args: string[]): Promise<void> {
    return this.run(...args).catch(error => this.log.error(error))
  }

  protected get log(): Logger {
    return this.logger
  }

  protected throttle<T>(callback: () => Promise<T>): Promise<T> {
    return this.throttler(async (...args: any[]) => await callback(...args))
  }

  public abstract get name(): string
  protected abstract run(...args: string[]): Promise<void>
}

export const ScriptType = Symbol('Script')
