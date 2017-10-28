import container from './inversify.config'
import * as path from 'path'
import * as core from './core'

const scheduler = container.get<core.Scheduler>(core.Scheduler)
scheduler.start('nas-schedule.json')
