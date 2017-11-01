import 'reflect-metadata'

import hydra = require('hydra')

import { injectable } from 'inversify'

import { FileSystem, Logger, Module, PlatformProvider, Reject } from '../core'
import { HydraModuleConfig } from './HydraModuleConfig'

@injectable()
export abstract class HydraModule extends Module {
  private reject: Reject
  constructor(files: FileSystem, logger: Logger, platform: PlatformProvider) {
    super(files, logger, platform)
  }

  public start(...args: string[]): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      this.reject = reject

      const config = await this.configure()

      try {
        const serviceConfig = await hydra.init(config, false)
        const service = await hydra.registerService()
        hydra.on('message', (message: any) => {
          this.log.trace('message', message)
        })
        await this.run(...args)
      } catch (error) {
        this.log.error(error)
        this.log.errorJSON(config)
        reject(error)
        process.exit(-1024)
      }
    })
  }

  public stop(): void {
    if (this.reject) {
      this.reject('stop')
    }
  }

  protected abstract configure(): Promise<HydraModuleConfig>
  protected abstract run(...args: string[]): Promise<void>
}
