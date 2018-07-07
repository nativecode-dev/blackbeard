import { Cluster, ClusterManager, CreateBucketOptions } from 'couchbase'

import { Logger } from '@beard/core'

export class AsyncManager {
  private readonly log: Logger
  private readonly manager: ClusterManager

  constructor(logger: Logger, cluster: Cluster, username?: string, password?: string) {
    this.log = logger.extend('manager')
    this.manager = (username && password) ? cluster.manager(username, password) : cluster.manager()
  }

  public createBucket(name: string, options: CreateBucketOptions = {}): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.manager.createBucket(name, options, () => resolve(true))
    })
  }

  public listBuckets(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.log.trace('manager.listBuckets')
      this.manager.listBuckets((...args: any[]) => {
        this.log.trace('manager.listBuckets.result', ...args)
        resolve(args)
      })
    })
  }

  public removeBucket(name: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.manager.removeBucket(name, () => resolve())
    })
  }
}
