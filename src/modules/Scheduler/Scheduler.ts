import 'reflect-metadata'

import * as schedule from 'node-schedule'
import { inject, injectable, multiInject } from 'inversify'
import { Config, FileSystem, Logger, LoggerType, Module, PlatformProvider, Reject, Script, ScriptType } from '../../core'

interface JobConfig {
  schedule: schedule.RecurrenceRule | schedule.RecurrenceSpecDateRange | schedule.RecurrenceSpecObjLit
  script: string
}

@injectable()
export class Scheduler extends Module {
  private readonly scripts: Script[]
  private reject: Reject

  constructor(
    config: Config,
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

  public start(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      this.reject = reject
      try {
        const configs = await this.configs<JobConfig>()
        const jobs = configs.map((config: JobConfig) => this.job(config))
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

  public stop(): void {
    if (this.reject) {
      this.reject('stop')
    }
  }

  private job(config: JobConfig): schedule.Job {
    this.log.info(`creating job to run script "${config.script}"`)
    this.log.traceJSON(config.schedule)

    return schedule.scheduleJob(`job:${config.script}`, config.schedule, async () => {
      const scripts = this.scripts
        .filter(script => script.name === config.script)
        .map(script => script.start())

      await Promise.all(scripts)
    })
  }
}
