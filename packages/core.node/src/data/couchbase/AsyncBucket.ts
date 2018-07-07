import * as cb from 'couchbase'

import { Key, Keys } from './Couchbase'
import { Logger, Reject, Resolve } from '@beard/core'

import { AsyncCluster } from './AsyncCluster'
import { AsyncManager } from './AsyncManager'

export type QueryResponse = cb.Bucket.N1qlQueryResponse | cb.Bucket.ViewQueryResponse

export class AsyncBucket {
  public configThrottle?: number
  public connectionTimeout?: number
  public durabilityInterval?: number
  public durabilityTimeout?: number
  public managementTimeout?: number
  public nodeConnectionTimeout?: number
  public operationTimeout?: number
  public viewTimeout?: number

  private readonly bucket: cb.Bucket
  private readonly cluster: AsyncCluster
  private readonly log: Logger

  constructor(bucket: cb.Bucket, cluster: AsyncCluster, logger: Logger) {
    this.bucket = bucket
    this.cluster = cluster
    this.log = logger.extend('bucket')
  }

  public get clientVersion(): string {
    return this.bucket.clientVersion
  }

  public get lcbVersion(): string {
    return this.bucket.lcbVersion
  }

  public append<T>(key: Key, fragment: Partial<T>, options: cb.AppendOptions = {}): Promise<T> {
    return new Promise<any>((resolve, reject) => {
      this.bucket.append(key, fragment, options, this.result<T>(resolve, reject))
    })
  }

  public counter<T>(key: Key, fragment: T, delta: number = 1, options: cb.CounterOptions = {}): Promise<T> {
    return new Promise<any>((resolve, reject) => {
      this.bucket.counter(key, delta, this.result<T>(resolve, reject))
    })
  }

  public disconnect(): void {
    this.bucket.disconnect()
  }

  public enableN1ql(hosts: string | string[]): void {
    this.bucket.enableN1ql(hosts)
  }

  public get<T>(key: Key, options: any = {}): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.log.trace('get', key)
      this.bucket.get(key, options, this.result<T>(resolve, reject))
    })
  }

  public getAndLock<T>(key: Key, options: cb.GetAndLockOptions = {}): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.bucket.getAndLock(key, this.result<T>(resolve, reject))
    })
  }

  public getAndTouch<T>(key: Key, expiry: number, options: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.bucket.getAndTouch(key, expiry, options, this.result<T>(resolve, reject))
    })
  }

  public getMulti<T>(keys: Keys): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      this.bucket.getMulti(keys, this.results<T>(resolve, reject))
    })
  }

  public getReplica<T>(key: Key, options: cb.GetReplicaOptions): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.bucket.getReplica(key, options, this.result<T>(resolve, reject))
    })
  }

  public insert<T>(key: Key, options: cb.InsertOptions): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.bucket.insert(key, options, this.result<T>(resolve, reject))
    })
  }

  public manager(username?: string, password?: string): AsyncManager {
    return this.cluster.manager(username, password)
  }

  public prepend<T>(key: Key, fragment: T, options: cb.PrependOptions): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.bucket.prepend(key, fragment, this.result<T>(resolve, reject))
    })
  }

  public query<T>(query: cb.ViewQuery | cb.N1qlQuery, params: Object | Array<T>): Promise<QueryResponse> {
    return new Promise<QueryResponse>((resolve, reject) => {
      this.bucket.query(query, params, this.result<QueryResponse>(resolve, reject))
    })
  }

  public remove<T>(key: Key, options: cb.RemoveOptions): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.bucket.remove(key, options, this.result<T>(resolve, reject))
    })
  }

  public replace<T>(key: Key, value: T, options: cb.ReplaceOptions): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.bucket.replace(key, value, this.result<T>(resolve, reject))
    })
  }

  public setTranscoder(encoder: cb.Bucket.EncoderFunction, decoder: cb.Bucket.DecoderFunction): void {
    this.bucket.setTranscoder(encoder, decoder)
  }

  public touch(key: Key, expiry: number, options: cb.TouchOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.bucket.touch(key, expiry, options, this.void(resolve, reject))
    })
  }

  public unlock(key: Key, cas: cb.Bucket.CAS, options: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.bucket.unlock(key, cas, options, this.void(resolve, reject))
    })
  }

  public upsert<T>(key: Key, value: T, options: cb.UpsertOptions): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.bucket.upsert(key, value, options, this.result<T>(resolve, reject))
    })
  }

  protected result<T>(resolve: Resolve<T>, reject: Reject): cb.Bucket.OpCallback {
    return (error, result): void => {
      if (error) {
        this.log.errorJSON(error)
        reject(error)
      } else {
        this.log.traceJSON(result)
        resolve(result)
      }
    }
  }

  protected results<T>(resolve: Resolve<T[]>, reject: Reject): cb.Bucket.OpCallback {
    return (error, results): void => {
      if (error) {
        this.log.errorJSON(error)
        reject(error)
      } else {
        this.log.traceJSON(results)
        resolve(results)
      }
    }
  }

  protected safeResult<T>(resolve: Resolve<T>): cb.Bucket.OpCallback {
    return (error, result): void => {
      if (error) {
        this.log.errorJSON(error)
        resolve(undefined)
      } else {
        this.log.traceJSON(result)
        resolve(result)
      }
    }
  }

  protected safeResults<T>(resolve: Resolve<T[]>): cb.Bucket.OpCallback {
    return (error, results): void => {
      if (error) {
        this.log.errorJSON(error)
        resolve([])
      } else {
        this.log.traceJSON(results)
        resolve(results)
      }
    }
  }

  protected safeVoid(resolve: Resolve<void>): cb.Bucket.OpCallback {
    return error => {
      if (error) {
        this.log.errorJSON(error)
        resolve()
      } else {
        resolve()
      }
    }
  }

  protected void(resolve: Resolve<void>, reject: Reject): cb.Bucket.OpCallback {
    return error => {
      if (error) {
        this.log.errorJSON(error)
        reject(error)
      } else {
        resolve()
      }
    }
  }
}
