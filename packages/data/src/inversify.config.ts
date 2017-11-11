import 'reflect-metadata'
import container from '@nativecode/blackbeard.core'
import * as datastore from './datastore'

container.bind<datastore.DataStore>(datastore.DataStore).toSelf()
container.bind<datastore.CouchbaseFactory>(datastore.CouchbaseFactory).toSelf()
