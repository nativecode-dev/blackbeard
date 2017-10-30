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
  private readonly targets: DebugLoggerTargets
  private namespace: LoggerNamespace

  constructor() {
    super()
    this.namespace = new LoggerNamespace()
    this.targets = {}
    this.createTargets()
  }

  public extend(namespace: string): LoggerTarget {
    const target = new DebugLoggerTarget()
    target.namespace = this.namespace.extend(namespace)
    target.createTargets()
    return target
  }

  protected write(type: LogMessageType, message: string, ...args: string[]): Promise<void> {
    const key = this.key(this.namespace.value, type)
    const writer = this.targets[type]
    if (writer) {
      writer(message, ...args)
    }
    return Promise.resolve()
  }

  private createTargets(): void {
    Object.keys(LogMessageType).map(type => {
      this.targets[type] = debug(`${this.namespace.value}:${type.toLowerCase()}`)
    })
  }
}
