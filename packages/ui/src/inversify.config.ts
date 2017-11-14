import 'reflect-metadata'

import * as core from '@beard/core'
import * as browser from '@beard/core.browser'
import { Container } from 'inversify'

const container = new Container()

container.bind<Container>(Container).toConstantValue(container)

// Core
container.bind<core.Environment>(core.EnvironmentType).to(browser.BrowserEnvironment).inSingletonScope()

// Logging
container.bind<core.Logger>(core.LoggerType).to(core.DefaultLogger).inSingletonScope()
container.bind<core.LoggerNamespace>(core.LoggerNamespace).toSelf()

// Logging targets
container.bind<core.LoggerTarget>(core.LoggerTargetType).to(core.ConsoleLoggerTarget)

// Clients
container.bind<core.Radarr>(core.Radarr).toSelf()
container.bind<core.Sonarr>(core.Sonarr).toSelf()

// AppConfig
container.bind<core.AppConfig>(core.AppConfig).toSelf().inSingletonScope()
container.bind<core.AppConfigProvider>(core.AppConfigProviderType).to(browser.BrowserAppConfigProvider).inSingletonScope()
container.bind<core.AppConfigProvider>(core.AppConfigProviderType).to(core.EnvironmentAppConfigProvider).inSingletonScope()

export default container
