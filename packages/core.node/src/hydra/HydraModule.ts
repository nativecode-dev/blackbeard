import 'reflect-metadata'

import * as hydra from 'hydra'

import { Logger, Reject } from '@beard/core'
import { injectable } from 'inversify'

import { FileSystem } from '../FileSystem'
import { HydraModuleConfig } from './HydraModuleConfig'
import { Module } from '../Module'
import { PlatformProvider } from '../PlatformProvider'

@injectable()
export abstract class HydraModule extends Module {
  private reject: Reject | undefined
  constructor(files: FileSystem, logger: Logger, platform: PlatformProvider) {
    super(files, logger, platform)
  }

  public start(...args: string[]): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      this.reject = reject

      const config = await this.configure()

      try {
        const service = await hydra.registerService()
        this.log.trace(`registered hydra service: ${service.serviceName}@${service.serviceIP}:${service.servicePort}`)
        hydra.on('message', (message: any) => this.log.trace('message', message))
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
