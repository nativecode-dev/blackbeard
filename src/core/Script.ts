import 'reflect-metadata'

import * as os from 'os'
import * as throttle from 'async-throttle'

import { injectable } from 'inversify'
import { Logger } from './Logger'
import { LoggerFactory } from './LoggerFactory'

export type IThrottle = (...args: any[]) => Promise<any>

@injectable()
export abstract class Script {
  private readonly logger: Logger
  private readonly throttler: (callback: IThrottle) => Promise<any>

  constructor(logger: LoggerFactory) {
    const max = os.cpus().length
    this.logger = logger.create(this.name)
    this.throttler = throttle(max)
    this.logger.trace(`throttling set to ${max}`)
  }

  public start(...args: string[]): Promise<void> {
    return this.run(...args).catch(error => this.log.error(error))
  }

  protected get log(): Logger {
    return this.logger
  }

  protected throttle(callback: throttle.IThrottleCallback): Promise<any> {
    return this.throttler(async (...args: any[]) => await callback(...args))
  }

  public abstract get name(): string
  protected abstract run(...args: string[]): Promise<void>
}

export const ScriptType = Symbol('Script')
