import 'reflect-metadata'

import * as URL from 'url'
import { Logger, LoggerType, Reject, Resolve } from '@beard/core'
import { Bucket, Cluster, ClusterConstructorOptions, CouchbaseError } from 'couchbase'
import { inject, injectable } from 'inversify'

export type Model<T> = T | undefined
export type ModelError = number | CouchbaseError
export type ModelResultCallback<T> = (error: ModelError, data: T) => void

@injectable()
export class DataStore {
  private readonly log: Logger
  private bucket: Bucket
  private cluster: Cluster
  private initialized: Promise<void>
  private _connected: boolean

  constructor( @inject(LoggerType) logger: Logger) {
    this.log = logger.extend('datastore')
  }

  public get connected(): boolean {
    return this._connected
  }

  public connect(url: string): Promise<void> {
    const uri = URL.parse(url)
    const bucket = uri.path && uri.path[0] === '/' ? uri.path.substring(1) : '/'
    const password = uri.auth ? uri.auth.split(':')[1] : ''

    return this.initialized = new Promise<void>((resolve, reject) => {
      try {
        const connection = `${uri.protocol}//${uri.hostname}`
        this.log.trace('connecting', connection, bucket)
        this.cluster = new Cluster(connection)
        this.bucket = this.cluster.openBucket(bucket, password, () => {
          this._connected = true
          this.log.trace('connected', connection, bucket)
          resolve()
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  public disconnect(): void {
    if (this.bucket) {
      this._connected = false
      this.bucket.disconnect()
    }
  }

  public async fetch<T>(key: string): Promise<Model<T>> {
    await this.initialized
    return new Promise<T>((resolve, reject) => {
      this.bucket.get(key, this.result<T>(resolve, reject))
    })
  }

  public async remove<T>(key: string): Promise<Model<T>> {
    await this.initialized
    return new Promise<T>((resolve, reject) => {
      this.bucket.remove(key, this.result<T>(resolve, reject))
    })
  }

  public async save<T>(key: string, model: T): Promise<T> {
    await this.initialized
    return new Promise<T>((resolve, reject) => {
      this.bucket.upsert(key, model, this.result<T>(resolve, reject))
    })
  }

  private result<T>(resolve: Resolve<T>, reject: Reject): ModelResultCallback<T> {
    return (error: ModelError, data: T): void => {
      if (error) {
        resolve(undefined)
      } else {
        resolve(data)
      }
    }
  }
}
