import 'reflect-metadata'

import { inject, injectable } from 'inversify'

import { HTTP } from './io'
import { Logger, LoggerType } from './logging'

@injectable()
export abstract class Client extends HTTP {
  constructor( @inject(LoggerType) logger: Logger) {
    super(logger)
  }
  protected onoff(value: boolean): string {
    return value ? 'on' : 'off'
  }
}
