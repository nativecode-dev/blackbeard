import { SchedulerJobType } from './enums'
import { SchedulerDateRange } from './SchedulerDateRange'
import { SchedulerObjectLiteral } from './SchedulerObjectLiteral'

export interface SchedulerJob {
  name: string
  schedule: string | SchedulerDateRange | SchedulerObjectLiteral
  type: SchedulerJobType
}
