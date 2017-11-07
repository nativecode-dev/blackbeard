import 'mocha'

import { expect } from 'chai'

import container from '../../inversify.config'
import { AsyncBucket } from './AsyncBucket'
import { AsyncCluster } from './AsyncCluster'
import { CouchbaseFactory } from './CouchbaseFactory'

const hostname = process.env.SEMANTIC_DATA_HOSTNAME || 'couchbase.nativecode.com'
const password = process.env.SEMANTIC_DATA_PASSWORD || ''
const username = process.env.SEMANTIC_DATA_USERNAME || 'semantic'

interface Context {
  cluster: () => AsyncCluster
  bucket: () => Promise<AsyncBucket>
  factory: () => CouchbaseFactory
}

const context: Context = {
  bucket: async (): Promise<AsyncBucket> => {
    const cluster = await context.cluster()
    return cluster.openBucket(username, password)
  },
  cluster: (): AsyncCluster => {
    const factory = context.factory()
    return factory.create(`couchbases://${hostname}:18091`)
  },
  factory: (): CouchbaseFactory => container.get<CouchbaseFactory>(CouchbaseFactory),
}

describe('when connecting to a couchbase cluster', () => {

  it('should open bucket', async () => {
    // Arrange
    // Act
    const bucket = await context.bucket()
    const result = await bucket.get<any>('test')
    console.log(result)

    // Assert
    expect(bucket).to.not.equal(undefined)
  }).timeout(5000)

})
