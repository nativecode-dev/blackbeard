export interface AppConfigProvider {
  handler(key: string): Promise<any>
}

export const AppConfigProviderType = Symbol('AppConfigProvider')

export class DefaultAppConfigProvider implements AppConfigProvider {
  public handler(key: string): Promise<any> {
    return Promise.resolve()
  }
}
