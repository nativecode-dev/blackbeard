import 'reflect-metadata'

import { injectable } from 'inversify'
import { HTTP } from './Http'

@injectable()
export abstract class Client extends HTTP {
  protected onoff(value: boolean): string {
    return value ? 'on' : 'off'
  }
}
