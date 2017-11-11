import 'reflect-metadata'

import * as cb from 'couchbase'
import { inject, injectable } from 'inversify'

import { Logger, LoggerType } from '../../core'
import { AsyncCluster } from './AsyncCluster'

@injectable()
export class CouchbaseFactory {
  private readonly log: Logger

  constructor( @inject(LoggerType) logger: Logger) {
    this.log = logger.extend('couchbase-factory')
  }

  public create(url: string, options?: cb.ClusterConstructorOptions): AsyncCluster {
    this.log.trace('couchbase.create', url)
    return new AsyncCluster(this.log, url, options)
  }
}
