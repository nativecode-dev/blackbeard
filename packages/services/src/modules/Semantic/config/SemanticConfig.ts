import { HydraModuleConfig } from '@nativecode/blackbeard.core.server'
import { SemanticSettings } from './SemanticSettings'

export interface SemanticConfig {
  module: HydraModuleConfig
  settings: SemanticSettings
}
