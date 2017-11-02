import { DataMessage } from './messages'

export interface IRCWatcherClient {
  id: string
  destroy(): void
  process(event: string, data: DataMessage): void
}

export type IRCFactoryClientEvent = (data: DataMessage) => void

export interface IRCWatcherClientEvents {
  [key: string]: IRCFactoryClientEvent
}
