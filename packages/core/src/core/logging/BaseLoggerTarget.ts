import 'reflect-metadata'

import * as debug from 'debug'
import { injectable } from 'inversify'
import { LoggerNamespace } from './LoggerNamespace'
import { LoggerTarget } from './LoggerTarget'
import { LogMessageType } from './LogMessageType'

@injectable()
export abstract class BaseLoggerTarget implements LoggerTarget {
  public abstract extend(namespace: string): LoggerTarget

  public object(type: LogMessageType, object: any): Promise<void> {
    return this.write(type, JSON.stringify(object))
  }

  public text(type: LogMessageType, message: string, ...args: string[]): Promise<void> {
    return this.write(type, message, ...args)
  }

  protected key(namespace: string, type: string): string {
    return `${namespace}:${type}`
  }

  protected abstract write(type: LogMessageType, message: string, ...args: string[]): Promise<void>
}

export const BaseLoggerTargetType = Symbol('BaseLoggerTarget')
