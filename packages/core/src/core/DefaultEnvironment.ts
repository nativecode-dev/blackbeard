import { Environment } from './Environment'

export class DefaultEnvironment implements Environment {
  public load<T>(filename: string): Promise<T> {
    return Promise.resolve({} as T)
  }

  public save<T>(filename: string, value: T): Promise<void> {
    return Promise.resolve()
  }

  public var(name: string, defaultValue: string = ''): string {
    return defaultValue
  }
}
