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

describe('when connecting to a couchbase cluster', async () => {
  const context: Context = {
    bucket: async () => await context.cluster().openBucket(username, password),
    cluster: () => context.factory().create(`couchbase://${username}:${password}@${hostname}`),
    factory: () => container.get<CouchbaseFactory>(CouchbaseFactory),
  }

  it('should open bucket', async () => {
    // Arrange
    // Act
    // Assert
    expect(await context.bucket()).to.not.equal(undefined)
  })

  describe('to work with documents', async () => {
    it('should return undefined when key does not exist', async () => {
      // Arrange
      const key = 'test.key'

      // Act
      const result = (await context.bucket()).get(key)

      // Assert
      expect(result).to.equal(undefined)
    })
  })

})
