import { HydraModuleConfig } from '@nativecode/blackbeard.core.server'
import { IRCEntries } from './IRCEntry'

export interface IRCWatcherConfig {
  module: HydraModuleConfig
  servers: IRCEntries
}
