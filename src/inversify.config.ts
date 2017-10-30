import 'reflect-metadata'

import * as process from 'process'
import * as core from './core'
import * as clients from './index'
import * as modules from './modules'
import * as scripts from './scripts'

import { Container } from 'inversify'
import { DefaultLogger } from './core/logging/DefaultLogger'

const container = new Container()

container.bind<Container>(Container).toConstantValue(container)

// Core
container.bind<core.Config>(core.Config).toSelf().inSingletonScope()
container.bind<core.FileSystem>(core.FileSystem).toSelf().inSingletonScope()
container.bind<core.Variables>(core.Variables).toSelf().inSingletonScope()

// Logging
container.bind<core.Logger>(core.LoggerType).to(DefaultLogger).inSingletonScope()
container.bind<core.LoggerNamespace>(core.LoggerNamespace).toSelf()

// Logging targets
container.bind<core.LoggerTarget>(core.LoggerTargetType).to(core.DebugLoggerTarget)

// Clients
container.bind<clients.Radarr>(clients.Radarr).toSelf()
container.bind<clients.Sonarr>(clients.Sonarr).toSelf()

// Modules
container.bind<modules.IRCWatcher>(modules.IRCWatcher).toSelf()
container.bind<modules.Scheduler>(modules.Scheduler).toSelf()

// Scripts
container.bind<core.Script>(core.ScriptType).to(scripts.UnMonitorCompletedMovies)
container.bind<core.Script>(core.ScriptType).to(scripts.UnMonitorCompletedSeasons)

export default container
