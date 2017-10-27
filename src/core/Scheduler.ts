import 'reflect-metadata'

import * as schedule from 'node-schedule'
import { injectable } from 'inversify'
import { FileSystem } from './FileSystem'
import { Script } from './Script'
import { ScriptFactory } from './ScriptFactory'

interface JobConfig {
  schedule: schedule.RecurrenceRule | schedule.RecurrenceSpecDateRange | schedule.RecurrenceSpecObjLit
  script: string
}

@injectable()
export class Scheduler {
  private readonly files: FileSystem
  private readonly scripts: Script[]

  constructor(scripts: ScriptFactory) {
    this.scripts = scripts.scripts()
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
    return schedule.scheduleJob(`job:${config.script}`, config.schedule, (): void => {
      // Dispatch script execution
    })
  }
}
