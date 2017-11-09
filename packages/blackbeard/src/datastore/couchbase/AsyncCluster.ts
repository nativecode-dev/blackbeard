import { Cluster, ClusterConstructorOptions, CouchbaseError } from 'couchbase'

import { AsyncBucket } from './AsyncBucket'
import { AsyncManager } from './AsyncManager'
import { Logger } from '../../core'

export class AsyncCluster {
  public readonly cluster: Cluster
  private readonly log: Logger

  constructor(logger: Logger, url: string, options?: ClusterConstructorOptions) {
    this.cluster = new Cluster(url, options)
    this.log = logger.extend('cluster')
    this.log.trace('connection', url)
  }

  public manager(username?: string, password?: string): AsyncManager {
    this.log.trace('cluster.manager', username)
    return new AsyncManager(this.log, this.cluster, username, password)
  }

  public openBucket(name?: string, password?: string): Promise<AsyncBucket> {
    return new Promise<AsyncBucket>((resolve, reject) => {
      this.log.trace('cluster.openBucket', name)
      const bucket = this.cluster.openBucket(name, password, (error: CouchbaseError, ...args: any[]) => {
        if (error) {
          this.log.errorJSON(error)
          reject(error)
        } else {
          this.log.trace('cluster.openBucket.args', ...args)
          this.log.trace('cluster.openBucket.result', name)
          resolve(new AsyncBucket(bucket, this, this.log))
        }
      })
    })
  }
}
