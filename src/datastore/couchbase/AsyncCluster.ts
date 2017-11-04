import { Cluster, ClusterConstructorOptions } from 'couchbase'
import { Url } from 'url'

import { AsyncBucket } from './AsyncBucket'
import { AsyncManager } from './AsyncManager'
import { Logger } from '../../core'

export class AsyncCluster {
  public readonly cluster: Cluster
  private readonly log: Logger

  constructor(logger: Logger, url: string | Url, options?: ClusterConstructorOptions) {
    this.cluster = new Cluster(url.toString(), options)
    this.log = logger.extend('cluster')
  }

  public manager(username?: string, password?: string): AsyncManager {
    this.log.trace('cluster.manager', username)
    return new AsyncManager(this.log, this.cluster, username, password)
  }

  public openBucket(name?: string, password?: string): Promise<AsyncBucket> {
    return new Promise<AsyncBucket>((resolve, reject) => {
      this.log.trace('cluster.openBucket', name)
      const bucket = this.cluster.openBucket(name, password, () => {
        this.log.trace('cluster.openBucket.result', name)
        resolve(new AsyncBucket(bucket, this))
      })
    })
  }
}
