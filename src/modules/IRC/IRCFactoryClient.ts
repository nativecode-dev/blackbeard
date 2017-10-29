import * as ircformatting from 'irc-formatting'
import { IRCInterfaces, IRCClientOptions } from 'irc-factory'
import { Logger } from '../../core'
import { DataMessage } from './DataMessage'
import { IRCEntry } from './IRCEntry'
import { IRCParser } from './IRCParser'

export interface IRCFactoryClient {
  id: string
  destroy(): void
  process(event: string, data: DataMessage): void
}

type IRCFactoryClientEvent = (data: DataMessage) => void

interface IRCFactoryClientEvents {
  [key: string]: IRCFactoryClientEvent
}

export class InternalIRCFactoryClient implements IRCFactoryClient {
  private readonly handlers: IRCFactoryClientEvents
  private readonly interfaces: IRCInterfaces
  private readonly log: Logger
  private readonly entry: IRCEntry
  private readonly name: string
  private readonly parser: IRCParser

  constructor(name: string, entry: IRCEntry, interfaces: IRCInterfaces, logger: Logger) {
    this.handlers = {}
    this.interfaces = interfaces
    this.log = logger.extend('irc-factory-client')
    this.entry = entry
    this.name = name

    this.handlers.privmsg = this.privmsg
    this.handlers.registered = this.registered

    this.parser = new IRCParser(this.log, this.entry.parser)

    this.log.trace(`creating irc client ${this.id}`)
    this.interfaces.rpc.emit('createClient', this.id, entry.connection)
  }

  public get id(): string {
    return `client:${this.name}`
  }

  public destroy(): void {
    this.log.trace(`destroying client ${this.id}`)
    this.interfaces.rpc.emit('destroyClient', this.id)
  }

  public process(event: string, data: DataMessage): void {
    try {
      this.log.trace('processing event', event)
      const handler = this.handlers[event]
      if (handler) {
        this.log.trace('delegating event', event)
        handler(data)
      }
    } catch (error) {
      this.log.traceJSON(data)
      this.log.error(error)
    }
  }

  private privmsg = (data: DataMessage): void => {
    this.log.trace('privmsg', JSON.stringify(data))
    if (data.body && data.body.username) {
      const sender = data.body.username.toLowerCase()
      const filtered = this.entry.parser.filtering.username.toLowerCase()
      if (sender === filtered) {
        const result = this.parser.parse(ircformatting.strip(data.body.message))
        this.log.traceJSON(result)
      }
    }
  }

  private registered = (data: DataMessage): void => {
    this.log.trace('joining', ...this.entry.channels)
    this.interfaces.rpc.emit('call', this.id, 'join', this.entry.channels)
  }
}
