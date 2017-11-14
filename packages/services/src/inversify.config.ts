import 'reflect-metadata'

import * as process from 'process'
import * as core from '@beard/core'
import * as node from '@beard/core.node'

import { Container } from 'inversify'

import * as modules from './modules'

const container = new Container()

container.bind<Container>(Container).toConstantValue(container)

// Core
container.bind<core.Environment>(core.EnvironmentType).to(node.NodeEnvironment).inSingletonScope()

// Node
container.bind<node.Config>(node.Config).toSelf().inSingletonScope()
container.bind<node.FileSystem>(node.FileSystem).toSelf().inSingletonScope()
container.bind<node.PlatformProvider>(node.PlatformProvider).toSelf().inSingletonScope()
container.bind<node.Variables>(node.Variables).toSelf().inSingletonScope()

// Logging
container.bind<core.Logger>(core.LoggerType).to(core.DefaultLogger).inSingletonScope()
container.bind<core.LoggerNamespace>(core.LoggerNamespace).toSelf()

// Logging targets
container.bind<core.LoggerTarget>(core.LoggerTargetType).to(core.ConsoleLoggerTarget)
container.bind<core.LoggerTarget>(core.LoggerTargetType).to(node.DebugLoggerTarget)

// Clients
container.bind<core.Radarr>(core.Radarr).toSelf()
container.bind<core.Sonarr>(core.Sonarr).toSelf()

// AppConfig
container.bind<core.AppConfig>(core.AppConfig).toSelf().inSingletonScope()
container.bind<core.AppConfigProvider>(core.AppConfigProviderType).to(core.EnvironmentAppConfigProvider).inSingletonScope()

// Modules
container.bind<node.Module>(node.ModuleType).to(modules.IRCWatcher).inSingletonScope()
container.bind<node.Module>(node.ModuleType).to(modules.Scheduler).inSingletonScope()

// Scripts
container.bind<node.Script>(node.ScriptType).to(node.UnMonitorCompletedMovies)
container.bind<node.Script>(node.ScriptType).to(node.UnMonitorCompletedSeasons)

container.bind<node.DataStore>(node.DataStore).toSelf()
container.bind<node.CouchbaseFactory>(node.CouchbaseFactory).toSelf()

export default container
