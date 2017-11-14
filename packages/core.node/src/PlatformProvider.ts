import 'reflect-metadata'

import { Platform } from 'common-locations'
import { injectable } from 'inversify'

import { Config } from './Config'

@injectable()
export class PlatformProvider {
  private readonly _platform: Platform

  constructor(config: Config) {
    this._platform = new Platform(config.appname)
  }

  public get platform(): Platform {
    return this._platform
  }
}
