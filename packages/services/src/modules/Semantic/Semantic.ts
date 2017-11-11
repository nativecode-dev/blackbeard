import { HydraModule, HydraModuleConfig } from '@nativecode/blackbeard.core'
import { SemanticConfig } from './config'

export class Semantic extends HydraModule {
  private semanticConfig: SemanticConfig

  public get name(): string {
    return 'semantic'
  }

  protected async configure(): Promise<HydraModuleConfig> {
    this.semanticConfig = await this.getConfig<SemanticConfig>()
    return this.semanticConfig.module
  }

  protected run(...args: string[]): Promise<void> {
    return Promise.resolve()
  }
}
