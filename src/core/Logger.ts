import * as debug from 'debug'

const scrub = (object: any): any => object

export enum LogMessageType {
  Debug = 'debug',
  Error = 'error',
  Fatal = 'fatal',
  Info = 'info',
  Silly = 'silly',
  Trace = 'trace',
  Warn = 'warn',
}

export interface Logger {
  extend(namespace: string): Logger
  debug(message: string, ...args: string[]): void
  debugJSON(object: any): void
  error(message: string, ...args: string[]): void
  errorJSON(object: any): void
  info(message: string, ...args: string[]): void
  infoJSON(object: any): void
  silly(message: string, ...args: string[]): void
  sillyJSON(object: any): void
  trace(message: string, ...args: string[]): void
  traceJSON(object: any): void
  warn(message: string, ...args: string[]): void
  warnJSON(object: any): void
}

interface DebugLogWriters {
  [key: string]: debug.IDebugger
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

  public debugJSON(object: any): void {
    this.debug(JSON.stringify(scrub(object)))
  }

  public error(message: string, ...args: string[]): void {
    this.writeError(message, ...args)
  }

  public errorJSON(object: any): void {
    this.error(JSON.stringify(scrub(object)))
  }

  public info(message: string, ...args: string[]): void {
    this.writeInfo(message, ...args)
  }

  public infoJSON(object: any): void {
    this.info(JSON.stringify(scrub(object)))
  }

  public silly(message: string, ...args: string[]): void {
    this.writeSilly(message, ...args)
  }

  public sillyJSON(object: any): void {
    this.silly(JSON.stringify(scrub(object)))
  }

  public trace(message: string, ...args: string[]): void {
    this.writeTrace(message, ...args)
  }

  public traceJSON(object: any): void {
    this.trace(JSON.stringify(scrub(object)))
  }

  public warn(message: string, ...args: string[]): void {
    this.writeWarn(message, ...args)
  }

  public warnJSON(object: any): void {
    this.warn(JSON.stringify(scrub(object)))
  }
}

export const DefaultLogger: DebugLogger = DebugLogger.create('nativecode:blackbeard')
