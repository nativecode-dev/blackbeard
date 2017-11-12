import 'reflect-metadata'

import * as debug from 'debug'
import { BaseLoggerTarget, LoggerNamespace, LoggerTarget, LogMessageType } from '@beard/core'
import { injectable } from 'inversify'

type ConsoleLogMethod = (...args: any[]) => void

interface ConsoleLoggerTargets {
  [key: string]: ConsoleLogMethod
}

@injectable()
export class ConsoleLoggerTarget extends BaseLoggerTarget {
  private readonly targets: ConsoleLoggerTargets
  private namespace: LoggerNamespace

  constructor() {
    super()
    this.namespace = new LoggerNamespace()
    this.targets = {}
    this.createTargets()
  }

  public extend(namespace: string): LoggerTarget {
    const target = new ConsoleLoggerTarget()
    if (target.namespace.value !== namespace) {
      target.namespace = target.namespace.create(namespace)
      target.createTargets()
    }
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
      const namespace = `${this.namespace.value}:${type.toLowerCase()}`
      this.targets[type] = (...args: any[]): void => {
        console.log(...args)
      }
    })
  }
}
