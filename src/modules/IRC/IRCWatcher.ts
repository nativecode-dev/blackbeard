import 'reflect-metadata'

import { Api, IRCInterfaces, IRCRPC, IRCClientOptions, IRCMessage, IRCOptions } from 'irc-factory'
import { inject, injectable } from 'inversify'
import { Config, Converters, Logger, LoggerType, Variables } from '../../core'
import { DataMessage } from './DataMessage'
import { Radarr, Sonarr } from '../../index'
import { IRCEntries, IRCEntry, IRCParserClientKind } from './IRCEntry'
import { IRCWatcherClient } from './IRCWatcherClient'
import { IRCWatcherClientImpl } from './IRCWatcherClientImpl'
import { IRCParserRecord } from './IRCParser'
import { Protocol, ReleaseInfo } from '../../models'

interface IRCFactoryClients {
  [key: string]: IRCWatcherClient
}

type IRCWatcherHandler = (name: string, entry: IRCEntry, interfaces: IRCInterfaces) => void

interface IRCWatcherHandlers {
  [key: string]: IRCWatcherHandler
}

@injectable()
export class IRCWatcher {
  private readonly clients: IRCFactoryClients
  private readonly config: Config
  private readonly handlers: IRCWatcherHandlers
  private readonly log: Logger
  private readonly radarr: Radarr
  private readonly sonarr: Sonarr
  private readonly vars: Variables

  constructor(config: Config, @inject(LoggerType) logger: Logger, radarr: Radarr, sonarr: Sonarr, vars: Variables) {
    this.clients = {}
    this.handlers = {}

    this.config = config
    this.log = logger.extend('ircwatcher')
    this.radarr = radarr
    this.sonarr = sonarr
    this.vars = vars

    this.handlers.synchronize = this.synchronize
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

  public start(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const api = new Api()
      const config = await this.config.load<IRCEntries>('nas-ircwatch.json')

      Object.keys(config).forEach(key => {
        const entry = config[key]
        const interfaces = api.connect(entry.api)
        interfaces.events.on('message', (data: DataMessage): void => this.process(data, key, entry, interfaces))
      })

      process.on('beforeExit', () => Object.keys(this.clients)
        .map(key => this.clients[key])
        .forEach(client => client.destroy())
      )
    })
  }

  private process(data: DataMessage, key: string, entry: IRCEntry, interfaces: IRCInterfaces): void {
    try {
      if (data.event instanceof Array) {
        const clientId = data.event[0]
        const event = data.event[1]
        const client = this.clients[key]
        if (clientId === client.id) {
          client.process(event, data)
        }
        return
      }

      const event = data.event as string
      if (this.handlers[event]) {
        const handler = this.handlers[event]
        handler(key, entry, interfaces)
      } else {
        this.log.trace(`unconsumed event: ${event}`)
      }
    } catch (error) {
      this.log.traceJSON(data)
      this.log.error(error)
    }
  }

  private synchronize = (name: string, entry: IRCEntry, interfaces: IRCInterfaces): void => {
    this.log.trace(`synchronize: ${name}`)
    this.clients[name] = new IRCWatcherClientImpl(name, entry, this, interfaces, this.log)
  }
}
