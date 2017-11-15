import { Dictionary } from '@beard/core'
import { Filter } from './Filter'

export interface Query<T> extends Dictionary<any> {
  filters: Filter<T>[]
}
