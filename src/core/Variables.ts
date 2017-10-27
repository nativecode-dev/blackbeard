import 'reflect-metadata'
import { injectable } from 'inversify'

@injectable()
export class Variables {
  public get(name: string, defaultValue: string = '', fixcase: boolean = true): string {
    const key = fixcase ? name.toUpperCase() : name
    if (process.env[key]) {
      return process.env[key] || defaultValue
    }
    return defaultValue
  }
}
