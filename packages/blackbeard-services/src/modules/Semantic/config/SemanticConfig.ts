import { HydraModuleConfig } from 'blackbeard'
import { SemanticSettings } from './SemanticSettings'

export interface SemanticConfig {
  module: HydraModuleConfig
  settings: SemanticSettings
}
