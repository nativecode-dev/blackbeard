import * as debug from 'debug'

export interface Logger {
  extend(namespace: string): Logger
  debug(message: string, ...args: string[]): void
  error(message: string, ...args: string[]): void
  info(message: string, ...args: string[]): void
  silly(message: string, ...args: string[]): void
  trace(message: string, ...args: string[]): void
  warn(message: string, ...args: string[]): void
}

export class DebugLogger implements Logger {
  private readonly writeDebug: debug.IDebugger
  private readonly writeError: debug.IDebugger
  private readonly writeInfo: debug.IDebugger
  private readonly writeSilly: debug.IDebugger
  private readonly writeTrace: debug.IDebugger
  private readonly writeWarn: debug.IDebugger

  private readonly logger: debug.IDebugger

  private constructor(namespace: string, owner?: DebugLogger) {
    this.logger = owner ? debug(`${owner.logger.namespace}:${namespace}`) : debug(namespace)
    this.writeDebug = debug(`${this.logger.namespace}:debug`)
    this.writeError = debug(`${this.logger.namespace}:error`)
    this.writeInfo = debug(`${this.logger.namespace}:info`)
    this.writeSilly = debug(`${this.logger.namespace}:silly`)
    this.writeTrace = debug(`${this.logger.namespace}:trace`)
    this.writeWarn = debug(`${this.logger.namespace}:warn`)
  }

  public static create(namespace: string): DebugLogger {
    return new DebugLogger(namespace)
  }

  public static derive(namespace: string): Logger {
    return new DebugLogger(namespace, DefaultLogger)
  }

  public extend(namespace: string): DebugLogger {
    return new DebugLogger(namespace, this)
  }

  public debug(message: string, ...args: string[]): void {
    this.writeDebug(message, ...args)
  }

  public error(message: string, ...args: string[]): void {
    this.writeError(message, ...args)
  }

  public info(message: string, ...args: string[]): void {
    this.writeInfo(message, ...args)
  }

  public silly(message: string, ...args: string[]): void {
    this.writeSilly(message, ...args)
  }

  public trace(message: string, ...args: string[]): void {
    this.writeTrace(message, ...args)
  }

  public warn(message: string, ...args: string[]): void {
    this.writeWarn(message, ...args)
  }
}

export const DefaultLogger: DebugLogger = DebugLogger.create('nativecode:nas-scripts')
