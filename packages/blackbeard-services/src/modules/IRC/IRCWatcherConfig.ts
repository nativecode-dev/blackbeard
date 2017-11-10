import { HydraModuleConfig } from '../../hydra'
import { IRCEntries } from './IRCEntry'

export interface IRCWatcherConfig {
  module: HydraModuleConfig
  servers: IRCEntries
}
