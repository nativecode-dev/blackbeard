import { LogMessageType } from './LogMessageType'

export interface LoggerTarget {
  extend(namespace: string): LoggerTarget
  object(type: LogMessageType, object: any): Promise<void>
  text(type: LogMessageType, message: string, ...args: string[]): Promise<void>
}

export type LoggerTargets = LoggerTarget[]

export const LoggerTargetType = Symbol('LoggerTarget')
