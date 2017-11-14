import 'reflect-metadata'

import * as os from 'os'
import { injectable } from 'inversify'

const hostname = os.hostname().toLowerCase()

@injectable()
export class LoggerNamespace {
  private namespace: string

  constructor() {
    this.namespace = `nativecode:blackbeard:${hostname}:${process.pid}`
  }

  public get value(): string {
    return this.namespace
  }

  public clone(): LoggerNamespace {
    const clone = new LoggerNamespace()
    clone.namespace = this.namespace
    return clone
  }

  public create(namespace: string): LoggerNamespace {
    const clone = new LoggerNamespace()
    clone.namespace = namespace
    return clone
  }

  public extend(namespace: string): LoggerNamespace {
    const extension = new LoggerNamespace()
    extension.namespace = `${this.namespace}:${namespace}`
    return extension
  }
}

export const LoggerNamespaceType = Symbol('LoggerNamespace')
