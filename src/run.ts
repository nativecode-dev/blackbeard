import container from './inversify.config'
import * as path from 'path'
import * as core from './core'

const scheduler = container.get<core.Scheduler>(core.Scheduler)

const filename = path.join(process.cwd(), 'nas-schedule.json')
scheduler.start(filename)
