import 'reflect-metadata'

import * as process from 'process'
import * as blackbeard from '@nativecode/blackbeard.core'
import * as modules from './modules'

import { Container } from 'inversify'
import { DefaultLogger } from '@nativecode/blackbeard.core'

const container = new Container()

container.bind<Container>(Container).toConstantValue(container)

// Core
container.bind<blackbeard.Config>(blackbeard.Config).toSelf().inSingletonScope()
container.bind<blackbeard.FileSystem>(blackbeard.FileSystem).toSelf().inSingletonScope()
container.bind<blackbeard.PlatformProvider>(blackbeard.PlatformProvider).toSelf().inSingletonScope()
container.bind<blackbeard.Variables>(blackbeard.Variables).toSelf().inSingletonScope()

// Logging
container.bind<blackbeard.Logger>(blackbeard.LoggerType).to(DefaultLogger).inSingletonScope()
container.bind<blackbeard.LoggerNamespace>(blackbeard.LoggerNamespace).toSelf()

// Logging targets
container.bind<blackbeard.LoggerTarget>(blackbeard.LoggerTargetType).to(blackbeard.DebugLoggerTarget)

// Clients
container.bind<blackbeard.Radarr>(blackbeard.Radarr).toSelf()
container.bind<blackbeard.Sonarr>(blackbeard.Sonarr).toSelf()

// Modules
container.bind<blackbeard.Module>(blackbeard.ModuleType).to(modules.IRCWatcher).inSingletonScope()
container.bind<blackbeard.Module>(blackbeard.ModuleType).to(modules.Scheduler).inSingletonScope()

// Scripts
container.bind<blackbeard.Script>(blackbeard.ScriptType).to(blackbeard.UnMonitorCompletedMovies)
container.bind<blackbeard.Script>(blackbeard.ScriptType).to(blackbeard.UnMonitorCompletedSeasons)

container.bind<blackbeard.DataStore>(blackbeard.DataStore).toSelf()
container.bind<blackbeard.CouchbaseFactory>(blackbeard.CouchbaseFactory).toSelf()

export default container
