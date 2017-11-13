import 'reflect-metadata'

import { inject, injectable } from 'inversify'

import { AppConfigProvider } from './AppConfigProvider'
import { Environment, EnvironmentType } from './Environment'

@injectable()
export class EnvironmentAppConfigProvider implements AppConfigProvider {
  private readonly env: Environment

  constructor( @inject(EnvironmentType) env: Environment) {
    this.env = env
  }

  public handler(key: string): Promise<string> {
    return Promise.resolve(this.env.var(key))
  }
}
