import { HydraModuleConfig } from '@nativecode/blackbeard.core'
import { IRCEntries } from './IRCEntry'

export interface IRCWatcherConfig {
  module: HydraModuleConfig
  servers: IRCEntries
}
