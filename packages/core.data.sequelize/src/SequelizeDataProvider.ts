import { DataProvider, Filter, Model, Operator, Query } from '@beard/core.data'

import { SequelizeQuery } from './SequelizeQuery'

export class SequelizeDataProvider implements DataProvider {
  public query<SequelizeQuery, TModel extends Model>(query: SequelizeQuery): Promise<TModel[]> {
    return Promise.reject('not implemented')
  }

  public queryFor<TModel extends Model>(): Promise<TModel> {
    return Promise.reject('not implemented')
  }
}
