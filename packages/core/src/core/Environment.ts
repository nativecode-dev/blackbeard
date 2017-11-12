export interface Environment {
  load<T>(filename: string): Promise<T>
  save<T>(filename: string, value: T): Promise<void>
  var(name: string, defaultValue?: string): string
}

export const EnvironmentType = Symbol('Environment')
