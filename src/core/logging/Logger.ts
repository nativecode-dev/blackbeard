export interface Logger {
  extend(namespace: string): Logger

  debug(message: string, ...args: any[]): void

  debugJSON(object: any): void

  error(message: string, ...args: any[]): void

  errorJSON(object: any): void

  fatal(message: string, ...args: any[]): void

  fatalJSON(object: any): void

  info(message: string, ...args: any[]): void

  infoJSON(object: any): void

  silly(message: string, ...args: any[]): void

  sillyJSON(object: any): void

  trace(message: string, ...args: any[]): void

  traceJSON(object: any): void

  warn(message: string, ...args: any[]): void

  warnJSON(object: any): void
}

export const LoggerType = Symbol('Logger')
