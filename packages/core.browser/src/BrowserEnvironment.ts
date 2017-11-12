import 'reflect-metadata'

import { injectable } from 'inversify'
import { Dictionary, Environment } from '@beard/core'

interface Window extends Dictionary<any> {
  env?: Dictionary<string>
}

@injectable()
export class BrowserEnvironment implements Environment {
  private readonly window: Window

  constructor() {
    this.window = window
  }

  public load<T>(filename: string): Promise<T> {
    return Promise.reject(new Error('not supported'))
  }

  public save<T>(filename: string, value: T): Promise<void> {
    return Promise.reject(new Error('not supported'))
  }

  public var(name: string, defaultValue: string = ''): string {
    const envname = name.toUpperCase()
    if (this.window.env && this.window.env[envname]) {
      return this.window.env[envname] || defaultValue
    }
    return defaultValue
  }
}
