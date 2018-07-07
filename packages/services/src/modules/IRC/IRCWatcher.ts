import 'reflect-metadata'

import { Api, IRCInterfaces } from 'irc-factory'
import { inject, injectable } from 'inversify'

import { DataMessage } from './messages'
import { IRCEntry, IRCParserClientKind } from './IRCEntry'
import { IRCWatcherClient } from './IRCWatcherClient'
import { IRCWatcherConfig } from './IRCWatcherConfig'
import { IRCWatcherClientImpl } from './IRCWatcherClientImpl'
import { IRCParserRecord } from './IRCParser'

import {
  Logger,
  LoggerType,
  Protocol,
  ReleaseInfo,
  Radarr,
  Sonarr,
} from '@beard/core'

import {
  FileSystem,
  HydraModule,
  HydraModuleConfig,
  PlatformProvider,
} from '@beard/core.node'

interface IRCFactoryClients {
  [key: string]: IRCWatcherClient
}

type IRCWatcherHandler = (name: string, entry: IRCEntry, interfaces: IRCInterfaces) => void

interface IRCWatcherHandlers {
  [key: string]: IRCWatcherHandler
}

@injectable()
export class IRCWatcher extends HydraModule {
  private readonly clients: IRCFactoryClients
  private readonly handlers: IRCWatcherHandlers
  private readonly radarr: Radarr
  private readonly sonarr: Sonarr
  private watcherConfig: IRCWatcherConfig | undefined

  constructor(
    files: FileSystem,
    platform: PlatformProvider,
    radarr: Radarr,
    sonarr: Sonarr,
    @inject(LoggerType) logger: Logger
  ) {
    super(files, logger, platform)
    this.clients = {}
    this.handlers = { synchronize: this.synchronize }
    this.radarr = radarr
    this.sonarr = sonarr
  }

  public get name(): string {
    return 'ircwatch'
  }

  public publish(record: IRCParserRecord, category: IRCParserClientKind): Promise<void> {
    const release: ReleaseInfo = {
      downloadUrl: record.url,
      title: record.title,
      protocol: Protocol.Torrent,
      publishDate: new Date().toISOString(),
    }

    switch (category) {
      case IRCParserClientKind.Radarr:
        return this.radarr.release(release)

      case IRCParserClientKind.Sonarr:
        return this.sonarr.release(release)

      default:
        return Promise.reject(`Invalid category: ${category}`)
    }
  }

  protected async configure(): Promise<HydraModuleConfig> {
    this.watcherConfig = await this.getConfig<IRCWatcherConfig>()
    return this.watcherConfig.module
  }

  protected run(...args: string[]): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      if (this.watcherConfig === undefined) {
        reject('not configured')
        return
      }

      const api = new Api()
      const config = this.watcherConfig
      Object.keys(config.servers).forEach(key => {
        const entry = config.servers[key]
        const interfaces = api.connect(entry.api)
        interfaces.events.on('message', (data: DataMessage): void => this.process(data, key, entry, interfaces))
      })

      process.on('beforeExit', () => {
        Object.keys(this.clients)
          .map(key => this.clients[key])
          .forEach(client => client.destroy())

        resolve()
      }
      )
    })
  }

  private process(data: DataMessage, key: string, entry: IRCEntry, interfaces: IRCInterfaces): void {
    try {
      if (data.event instanceof Array) {
        const clientId = data.event[0]
        const event = data.event[1]
        const client = this.clients[key]
        if (client && clientId === client.id) {
          this.log.trace(`event.dispatch: ${client.id}:${event}`)
          client.process(event, data)
        }
        return
      }

      const event = data.event as string
      if (this.handlers[event]) {
        const handler = this.handlers[event]
        handler(key, entry, interfaces)
      } else {
        this.log.trace(`event.unconsumed: ${event}`)
      }
    } catch (error) {
      this.log.error(error)
      this.log.errorJSON(data)
    }
  }

  private synchronize = (name: string, entry: IRCEntry, interfaces: IRCInterfaces): void => {
    this.log.trace(`event.synchronize: ${name}@${entry.connection.server}`)
    this.clients[name] = new IRCWatcherClientImpl(name, entry, this, interfaces, this.log)
  }
}
