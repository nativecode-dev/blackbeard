import 'reflect-metadata'

import { injectable } from 'inversify'
import { AppConfigProvider } from '@beard/core'

import { BrowserWindow } from './BrowserWindow'

@injectable()
export class BrowserAppConfigProvider implements AppConfigProvider {
  private readonly window: BrowserWindow

  constructor() {
    this.window = window
  }

  public handler(key: string): Promise<any> {
    return Promise.resolve(this.window[key])
  }
}
