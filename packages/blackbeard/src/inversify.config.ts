import 'reflect-metadata'

import * as process from 'process'
import * as core from './core'
import * as acb from './datastore/couchbase'
import * as datastore from './datastore'
import * as modules from './modules'
import * as scripts from './scripts'

import { Container } from 'inversify'
import { DefaultLogger } from './core/logging/DefaultLogger'

const container = new Container()

container.bind<Container>(Container).toConstantValue(container)

// Core
container.bind<core.Config>(core.Config).toSelf().inSingletonScope()
container.bind<core.FileSystem>(core.FileSystem).toSelf().inSingletonScope()
container.bind<core.PlatformProvider>(core.PlatformProvider).toSelf().inSingletonScope()
container.bind<core.Variables>(core.Variables).toSelf().inSingletonScope()

// Logging
container.bind<core.Logger>(core.LoggerType).to(DefaultLogger).inSingletonScope()
container.bind<core.LoggerNamespace>(core.LoggerNamespace).toSelf()

// Logging targets
container.bind<core.LoggerTarget>(core.LoggerTargetType).to(core.DebugLoggerTarget)

// Clients
container.bind<core.Radarr>(core.Radarr).toSelf()
container.bind<core.Sonarr>(core.Sonarr).toSelf()

// Modules
container.bind<core.Module>(core.ModuleType).to(modules.IRCWatcher).inSingletonScope()
container.bind<core.Module>(core.ModuleType).to(modules.Scheduler).inSingletonScope()

// Scripts
container.bind<core.Script>(core.ScriptType).to(scripts.UnMonitorCompletedMovies)
container.bind<core.Script>(core.ScriptType).to(scripts.UnMonitorCompletedSeasons)

container.bind<datastore.DataStore>(datastore.DataStore).toSelf()
container.bind<acb.CouchbaseFactory>(acb.CouchbaseFactory).toSelf()

export default container
