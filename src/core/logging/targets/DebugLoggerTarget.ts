import 'reflect-metadata'

import * as debug from 'debug'
import { BaseLoggerTarget } from '../BaseLoggerTarget'
import { LoggerNamespace, LoggerTarget, LogMessageType } from '../index'
import { injectable } from 'inversify'

interface DebugLoggerTargets {
  [key: string]: debug.IDebugger
}

@injectable()
export class DebugLoggerTarget extends BaseLoggerTarget {
  private readonly namespace: LoggerNamespace
  private readonly targets: DebugLoggerTargets

  constructor(namespace: LoggerNamespace) {
    super()
    this.namespace = namespace
    this.targets = {}
    this.ensureTargets()
  }

  public extend(namespace: string): LoggerTarget {
    return new DebugLoggerTarget(this.namespace.extend(namespace))
  }

  protected write(type: LogMessageType, message: string, ...args: string[]): Promise<void> {
    const key = this.key(this.namespace.value, type)
    const writer = this.targets[key]
    if (writer) {
      writer(message, ...args)
    }
    return Promise.resolve()
  }

  private ensureTargets(): void {
    Object.keys(LogMessageType)
      .filter(type => !this.targets[type])
      .map(type => this.targets[type] = debug(`${this.namespace.value}:${type}`))
  }
}
