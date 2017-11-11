import { HydraModuleConfig } from '@nativecode/blackbeard.core.node'
import { SemanticSettings } from './SemanticSettings'

export interface SemanticConfig {
  module: HydraModuleConfig
  settings: SemanticSettings
}
