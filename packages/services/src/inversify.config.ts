import 'reflect-metadata'

import * as process from 'process'
import * as core from '@beard/core'
import * as server from '@beard/core.node'
import * as modules from './modules'

import { Container } from 'inversify'
import { DefaultLogger } from '@beard/core'

const container = new Container()

container.bind<Container>(Container).toConstantValue(container)

// Core
container.bind<server.Config>(server.Config).toSelf().inSingletonScope()
container.bind<server.FileSystem>(server.FileSystem).toSelf().inSingletonScope()
container.bind<server.PlatformProvider>(server.PlatformProvider).toSelf().inSingletonScope()
container.bind<server.Variables>(server.Variables).toSelf().inSingletonScope()

// Logging
container.bind<core.Logger>(core.LoggerType).to(DefaultLogger).inSingletonScope()
container.bind<core.LoggerNamespace>(core.LoggerNamespace).toSelf()

// Logging targets
container.bind<core.LoggerTarget>(core.LoggerTargetType).to(server.DebugLoggerTarget)

// Clients
container.bind<core.Radarr>(core.Radarr).toSelf()
container.bind<core.Sonarr>(core.Sonarr).toSelf()

// Modules
container.bind<server.Module>(server.ModuleType).to(modules.IRCWatcher).inSingletonScope()
container.bind<server.Module>(server.ModuleType).to(modules.Scheduler).inSingletonScope()

// Scripts
container.bind<server.Script>(server.ScriptType).to(server.UnMonitorCompletedMovies)
container.bind<server.Script>(server.ScriptType).to(server.UnMonitorCompletedSeasons)

container.bind<server.DataStore>(server.DataStore).toSelf()
container.bind<server.CouchbaseFactory>(server.CouchbaseFactory).toSelf()

export default container
