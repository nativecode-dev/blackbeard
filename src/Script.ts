import * as os from 'os'
import * as throttle from 'async-throttle'
import { ILogger, Logger } from './Logger'

export type IThrottle = (...args: any[]) => Promise<any>

export abstract class Script {
  private readonly logger: ILogger
  private readonly throttler: (callback: IThrottle) => Promise<any>

  constructor(name: string, max: number = os.cpus().length) {
    this.logger = Logger.extend(name)
    this.throttler = throttle(max)
    this.logger.debug(`throttling set to ${max}`)
  }

  public start(...args: string[]): Promise<void> {
    return this.run(...args).catch(error => this.log.error(error))
  }

  protected get log(): ILogger {
    return this.logger
  }

  protected throttle(callback: throttle.IThrottleCallback): Promise<any> {
    return this.throttler(async (...args: any[]) => await callback(...args))
  }

  protected abstract run(...args: string[]): Promise<void>
}
