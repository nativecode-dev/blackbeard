import { HydraModuleConfig } from 'blackbeard'
import { IRCEntries } from './IRCEntry'

export interface IRCWatcherConfig {
  module: HydraModuleConfig
  servers: IRCEntries
}
