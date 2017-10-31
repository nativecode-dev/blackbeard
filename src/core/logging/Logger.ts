export interface Logger {
  extend(namespace: string): Logger

  debug(message: string, ...args: string[]): void

  debugJSON(object: any): void

  error(message: string, ...args: string[]): void

  errorJSON(object: any): void

  fatal(message: string, ...args: string[]): void

  fatalJSON(object: any): void

  info(message: string, ...args: string[]): void

  infoJSON(object: any): void

  silly(message: string, ...args: string[]): void

  sillyJSON(object: any): void

  trace(message: string, ...args: string[]): void

  traceJSON(object: any): void

  warn(message: string, ...args: string[]): void

  warnJSON(object: any): void
}

export const LoggerType = Symbol('Logger')
