import { IRCInterfaces, IRCClientOptions } from 'irc-factory'

import { Logger } from '@nativecode/blackbeard-core'
import { DataMessage } from './messages'
import { IRCEntry } from './IRCEntry'
import { IRCParser } from './IRCParser'
import { IRCWatcher } from './IRCWatcher'
import { IRCWatcherClient, IRCWatcherClientEvents } from './IRCWatcherClient'

export class IRCWatcherClientImpl implements IRCWatcherClient {
  private readonly factory: IRCWatcher
  private readonly handlers: IRCWatcherClientEvents
  private readonly interfaces: IRCInterfaces
  private readonly log: Logger
  private readonly entry: IRCEntry
  private readonly name: string
  private readonly parser: IRCParser

  constructor(name: string, entry: IRCEntry, factory: IRCWatcher, interfaces: IRCInterfaces, logger: Logger) {
    this.factory = factory
    this.handlers = {}
    this.interfaces = interfaces
    this.log = logger.extend('client')
    this.entry = entry
    this.name = name

    this.handlers.privmsg = this.privmsg
    this.handlers.registered = this.registered

    this.parser = new IRCParser(this.log, this.entry.parser)

    this.log.trace(`creating irc client: ${this.id}`)
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
      this.log.trace('client.event', event)
      const handler = this.handlers[event]
      if (handler) {
        this.log.trace('client.event.dispatch', event)
        handler(data)
      }
    } catch (error) {
      this.log.error(error)
      this.log.errorJSON(data)
    }
  }

  private privmsg = async (data: DataMessage): Promise<void> => {
    this.log.trace('client.event.privmsg', JSON.stringify(data))
    if (data.message && data.message.username) {
      const sender = data.message.username.toLowerCase()
      const filtered = this.entry.parser.filtering.username.toLowerCase()
      if (sender === filtered) {
        const record = this.parser.parse(data.message.message)
        const category = this.entry.parser.filtering.category[record.category]
        if (category) {
          await this.factory.publish(record, category)
        }
      }
    }
  }

  private registered = (data: DataMessage): void => {
    this.log.trace('client.event.registered', ...this.entry.channels)
    this.interfaces.rpc.emit('call', this.id, 'join', this.entry.channels)
  }
}
