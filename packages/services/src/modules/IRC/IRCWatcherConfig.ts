import { HydraModuleConfig } from '@nativecode/blackbeard.core.node'
import { IRCEntries } from './IRCEntry'

export interface IRCWatcherConfig {
  module: HydraModuleConfig
  servers: IRCEntries
}
