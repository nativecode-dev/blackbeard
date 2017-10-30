import 'reflect-metadata'

import * as schedule from 'node-schedule'
import { injectable } from 'inversify'
import { Config, FileSystem, Logger, LoggerFactory, Script, ScriptFactory } from '../../core'

interface JobConfig {
  schedule: schedule.RecurrenceRule | schedule.RecurrenceSpecDateRange | schedule.RecurrenceSpecObjLit
  script: string
}

@injectable()
export class Scheduler {
  private readonly config: Config
  private readonly log: Logger
  private readonly scripts: Script[]

  constructor(config: Config, logger: LoggerFactory, scripts: ScriptFactory) {
    this.config = config
    this.log = logger.create('service:scheduler')
    this.scripts = scripts.get()
  }

  public start(): Promise<schedule.Job[]> {
    return new Promise<schedule.Job[]>(async (resolve, reject) => {
      try {
        const config = await this.config.load<JobConfig[]>('nas-scheduler.json')
        const jobs = config.map((config: JobConfig) => this.job(config))
        this.log.info(`${jobs.length} job(s) scheduled`)
        process.on('beforeExit', (): void => {
          jobs.forEach(job => job.cancel())
          resolve()
        })
        return await Promise.all(jobs)
      } catch (error) {
        this.log.error(error)
        reject(error)
      }
    })
  }

  private job(config: JobConfig): schedule.Job {
    this.log.trace(`creating job to run script ${config.script}`)
    this.log.traceJSON(config.schedule)

    return schedule.scheduleJob(`job:${config.script}`, config.schedule, async () => {
      const scripts = this.scripts
        .filter(script => script.name === config.script)
        .map(script => script.start())

      await Promise.all(scripts)
    })
  }
}
