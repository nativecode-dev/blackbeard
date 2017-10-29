import * as irc from 'irc-formatting'
import { IRCInterfaces, IRCClientOptions } from 'irc-factory'
import { Logger } from '../../core'
import { DataMessage } from './DataMessage'
import { IRCEntry } from './IRCEntry'
import { IRCFactory } from './IRCFactory'
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
  private readonly factory: IRCFactory
  private readonly handlers: IRCFactoryClientEvents
  private readonly interfaces: IRCInterfaces
  private readonly log: Logger
  private readonly entry: IRCEntry
  private readonly name: string
  private readonly parser: IRCParser

  constructor(name: string, entry: IRCEntry, factory: IRCFactory, interfaces: IRCInterfaces, logger: Logger) {
    this.factory = factory
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

  private privmsg = async (data: DataMessage): Promise<void> => {
    this.log.trace('privmsg', JSON.stringify(data))
    if (data.message && data.message.username) {
      const sender = data.message.username.toLowerCase()
      const filtered = this.entry.parser.filtering.username.toLowerCase()
      if (sender === filtered) {
        const record = this.parser.parse(irc.strip(data.message.message))
        const category = this.entry.parser.filtering.category[record.category]
        if (category) {
          await this.factory.publish(record, category)
        }
        this.log.traceJSON(record)
      }
    }
  }

  private registered = (data: DataMessage): void => {
    this.log.trace('joining', ...this.entry.channels)
    this.interfaces.rpc.emit('call', this.id, 'join', this.entry.channels)
  }
}