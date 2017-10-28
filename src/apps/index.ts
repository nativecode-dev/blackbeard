import container from '../inversify.config'
import * as path from 'path'
import * as core from '../core'

if (process.argv[2].toLowerCase() === 'scheduler') {
  container.get<core.Scheduler>(core.Scheduler).start('nas-schedule.json')
}
