import 'reflect-metadata'

import * as schedule from 'node-schedule'
import { inject, injectable, multiInject } from 'inversify'

import {
  Logger,
  LoggerType,
} from '@beard/core'

import {
  FileSystem,
  HydraModule,
  HydraModuleConfig,
  PlatformProvider,
  Script,
  ScriptType
} from '@beard/core.node'

interface JobConfig {
  schedule: schedule.RecurrenceRule | schedule.RecurrenceSpecDateRange | schedule.RecurrenceSpecObjLit
  script: string
}

interface SchedulerConfig {
  jobs: JobConfig[]
  module: HydraModuleConfig
}

@injectable()
export class Scheduler extends HydraModule {
  private readonly scripts: Script[]
  private schedulerConfig: SchedulerConfig | undefined

  constructor(
    files: FileSystem,
    platform: PlatformProvider,
    @inject(LoggerType) logger: Logger,
    @multiInject(ScriptType) scripts: Script[]
  ) {
    super(files, logger, platform)
    this.scripts = scripts
  }

  public get name(): string {
    return 'scheduler'
  }

  protected async configure(): Promise<HydraModuleConfig> {
    this.schedulerConfig = await this.getConfig<SchedulerConfig>()
    return this.schedulerConfig.module
  }

  protected run(...args: string[]): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      if (this.schedulerConfig === undefined) {
        reject('not configured')
        return
      }

      try {
        const jobs = this.schedulerConfig.jobs.map((config: JobConfig) => this.job(config))
        this.log.info(`${jobs.length} job(s) scheduled`)
        process.on('beforeExit', (): void => {
          jobs.forEach(job => job.cancel())
          resolve()
        })
        await Promise.all(jobs)
      } catch (error) {
        this.log.error(error)
        reject(error)
      }
    })
  }

  private job(config: JobConfig): schedule.Job {
    this.log.info(`creating job to run script "${config.script}"`)

    return schedule.scheduleJob(`job:${config.script}`, config.schedule, async () => {
      const scripts = this.scripts
        .filter(script => script.name === config.script)
        .map(script => script.start())

      await Promise.all(scripts)
    })
  }
}
