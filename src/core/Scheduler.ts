import 'reflect-metadata'

import * as schedule from 'node-schedule'
import { injectable } from 'inversify'
import { SchedulerJob } from './models'
import { FileSystem } from './FileSystem'

@injectable()
export class Scheduler {
  private readonly files: FileSystem

  public async start(configfile: string): Promise<void> {
    const config = await this.files.json<SchedulerJob[]>(configfile)
    config.forEach((job: SchedulerJob) => this.createJob(job))
    return Promise.resolve()
  }

  private createJob(job: SchedulerJob): schedule.Job {
    return schedule.scheduleJob(job.name, job.schedule, (): void => {
      // Do stuff
    })
  }
}
