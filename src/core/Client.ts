import 'reflect-metadata'

import { injectable } from 'inversify'
import { HTTP } from './Http'
import { LoggerFactory } from './LoggerFactory'

@injectable()
export abstract class Client extends HTTP {
  constructor(logger: LoggerFactory) {
    super(logger)
  }
  protected onoff(value: boolean): string {
    return value ? 'on' : 'off'
  }
}
