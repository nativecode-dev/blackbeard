import 'reflect-metadata'

import { injectable, multiInject } from 'inversify'
import { Logger } from './Logger'
import { LoggerNamespace } from './LoggerNamespace'
import { LoggerTarget, LoggerTargets, LoggerTargetType } from './LoggerTarget'
import { LogMessageType } from './LogMessageType'

@injectable()
export class DefaultLogger implements Logger {
  private readonly factory: LoggerTarget[]
  private readonly namespace: LoggerNamespace
  private readonly targets: LoggerTargets

  constructor(namespace: LoggerNamespace, @multiInject(LoggerTargetType) targets: LoggerTarget[]) {
    this.factory = targets
    this.namespace = namespace
    this.targets = targets.map(target => target.extend(this.namespace.value))
  }

  public extend(namespace: string): Logger {
    return new DefaultLogger(this.namespace.extend(namespace), this.factory)
  }

  public debug(message: string, ...args: any[]): void {
    this.targets.forEach(target => target.text(LogMessageType.Debug, message, ...args))
  }

  public debugJSON(object: any): void {
    this.targets.forEach(target => target.object(LogMessageType.Debug, object))
  }

  public error(message: string, ...args: any[]): void {
    this.targets.forEach(target => target.text(LogMessageType.Error, message, ...args))
  }

  public errorJSON(object: any): void {
    this.targets.forEach(target => target.object(LogMessageType.Error, object))
  }

  public fatal(message: string, ...args: any[]): void {
    this.targets.forEach(target => target.text(LogMessageType.Fatal, message, ...args))
  }

  public fatalJSON(object: any): void {
    this.targets.forEach(target => target.object(LogMessageType.Fatal, object))
  }

  public info(message: string, ...args: any[]): void {
    this.targets.forEach(target => target.text(LogMessageType.Info, message, ...args))
  }

  public infoJSON(object: any): void {
    this.targets.forEach(target => target.object(LogMessageType.Info, object))
  }

  public silly(message: string, ...args: any[]): void {
    this.targets.forEach(target => target.text(LogMessageType.Silly, message, ...args))
  }

  public sillyJSON(object: any): void {
    this.targets.forEach(target => target.object(LogMessageType.Silly, object))
  }

  public trace(message: string, ...args: any[]): void {
    this.targets.forEach(target => target.text(LogMessageType.Trace, message, ...args))
  }

  public traceJSON(object: any): void {
    this.targets.forEach(target => target.object(LogMessageType.Trace, object))
  }

  public warn(message: string, ...args: any[]): void {
    this.targets.forEach(target => target.text(LogMessageType.Warn, message, ...args))
  }

  public warnJSON(object: any): void {
    this.targets.forEach(target => target.object(LogMessageType.Warn, object))
  }
}
