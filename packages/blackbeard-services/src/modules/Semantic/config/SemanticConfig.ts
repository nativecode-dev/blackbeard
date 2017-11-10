import { HydraModuleConfig } from '@blackbeard/core'
import { SemanticSettings } from './SemanticSettings'

export interface SemanticConfig {
  module: HydraModuleConfig
  settings: SemanticSettings
}
