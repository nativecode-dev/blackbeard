import 'reflect-metadata'

import * as schedule from 'node-schedule'
import { injectable } from 'inversify'
import { FileSystem } from './FileSystem'
import { Logger } from './Logger'
import { LoggerFactory } from './LoggerFactory'
import { Script } from './Script'
import { ScriptFactory } from './ScriptFactory'

interface JobConfig {
  schedule: schedule.RecurrenceRule | schedule.RecurrenceSpecDateRange | schedule.RecurrenceSpecObjLit
  script: string
}

@injectable()
export class Scheduler {
  private readonly files: FileSystem
  private readonly log: Logger
  private readonly scripts: Script[]

  constructor(files: FileSystem, logger: LoggerFactory, scripts: ScriptFactory) {
    this.files = files
    this.log = logger.create('scheduler')
    this.scripts = scripts.get()
  }

  public async start(configfile: string): Promise<schedule.Job[]> {
    return new Promise<schedule.Job[]>(async (resolve, reject) => {
      try {
        const config = await this.files.json<JobConfig[]>(configfile)
        const jobs = config.map((config: JobConfig) => this.job(config))
        return resolve(Promise.all(jobs))
      } catch (error) {
        reject(error)
        throw error
      }
    })
  }

  private job(config: JobConfig): schedule.Job {
    this.log.trace(`creating job to run script ${config.script}`)
    this.log.traceJSON(config.schedule)

    return schedule.scheduleJob(`job:${config.script}`, config.schedule, (): void => {
      const scripts = this.scripts
        .filter(script => script.name === config.script)
        .map(script => script.start())

      Promise.all(scripts).catch(error => this.log.error(error))
    })
  }
}
