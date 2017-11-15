import { Model } from './Model'
import { Query } from './Query'

export interface DataProvider {
  query<TQuery extends Query<TModel>, TModel extends Model>(query: TQuery): Promise<TModel[]>
  queryFor<TModel extends Model>(dataProviderId: string): Promise<TModel>
}
