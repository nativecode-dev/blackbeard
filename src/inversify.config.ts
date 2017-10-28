import 'reflect-metadata'
import * as process from 'process'
import * as core from './core'
import * as clients from './index'
import * as scripts from './scripts'
import { Container } from 'inversify'

const container = new Container()

container.bind<Container>(Container).toConstantValue(container)

container.bind<core.FileSystem>(core.FileSystem).toSelf()
container.bind<core.LoggerFactory>(core.LoggerFactory).toSelf()
container.bind<core.Scheduler>(core.Scheduler).toSelf()
container.bind<core.Variables>(core.Variables).toSelf()

container.bind<clients.Radarr>(clients.Radarr).toSelf()
container.bind<clients.Sonarr>(clients.Sonarr).toSelf()

container.bind<core.Script>(core.ScriptType).to(scripts.UnMonitorCompletedMovies)
container.bind<core.Script>(core.ScriptType).to(scripts.UnMonitorCompletedSeasons)
container.bind<core.ScriptFactory>(core.ScriptFactory).toSelf()

export default container
