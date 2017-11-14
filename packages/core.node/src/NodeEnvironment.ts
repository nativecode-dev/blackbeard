import 'reflect-metadata'

import { injectable } from 'inversify'
import { Environment } from '@beard/core'
import { FileSystem } from './FileSystem'

@injectable()
export class NodeEnvironment implements Environment {
  private readonly files: FileSystem

  constructor(files: FileSystem) {
    this.files = files
  }

  public load<T>(filename: string): Promise<T> {
    return this.files.json<T>(filename)
  }

  public save<T>(filename: string, value: T): Promise<void> {
    return this.files.save<T>(filename, value)
  }

  public var(name: string, defaultValue: string = ''): string {
    const envname = name.toUpperCase()
    if (process.env[envname]) {
      return process.env[envname] || defaultValue
    }
    return defaultValue
  }
}
