import { Operator } from './Operator'

export interface Filter<T> {
  operator: Operator
  property: string
  value: T
}
