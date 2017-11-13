import 'reflect-metadata'

import { injectable, multiInject } from 'inversify'

import { AppConfigProvider, AppConfigProviderType, DefaultAppConfigProvider } from './AppConfigProvider'
import { ChainsAsync } from './ChainAsync'

@injectable()
export class AppConfig {
  private readonly providers: ChainsAsync<any>

  constructor( @multiInject(AppConfigProviderType) providers: AppConfigProvider[]) {
    this.providers = new ChainsAsync<any>(...providers.map(provider => provider.handler))
    this.providers.add(new DefaultAppConfigProvider().handler)
  }

  public get<T>(key: string, defaultValue?: T): Promise<T> {
    return this.providers.execute(key, () => Promise.resolve(defaultValue))
  }
}
