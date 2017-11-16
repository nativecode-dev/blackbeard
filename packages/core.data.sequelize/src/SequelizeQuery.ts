import { Filter, Model, Operator, Query } from '@beard/core.data'

export class SequelizeQuery<T extends Model> implements Query<T> {
  public get filters(): Filter<T>[] {
    return []
  }
}