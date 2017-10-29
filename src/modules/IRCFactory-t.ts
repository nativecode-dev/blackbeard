import 'reflect-metadata'

import { Api, ApiRpc, ClientOptions, Message, Options } from 'irc-factory'
import { injectable } from 'inversify'
import { Converters, Logger, LoggerFactory, Variables } from '../core'

@injectable()
export class IRCFactory {
  private readonly log: Logger
  private readonly vars: Variables

  constructor(logger: LoggerFactory, vars: Variables) {
    this.log = logger.create('irc-factory')
    this.vars = vars
  }

  public start(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const id = `client:${process.pid}`
      const options: Options = {
        automaticSetup: await this.vars.as('IRC_CONFIG_AUTOSTART', true, Converters.bool),
        events: await this.vars.get('IRC_CONFIG_EVENTS', 'tcp://127.0.0.1:31920'),
        fork: await this.vars.as('IRC_CONFIG_FORK', false, Converters.bool),
        rpc: await this.vars.get('IRC_CONFIG_RPC', 'tcp://127.0.0.1:31930'),
      }

      this.log.trace('irc.api.options', JSON.stringify(options))

      const api = new Api()
      const interfaces = api.connect(options)

      const events = interfaces.events
      const rpc = interfaces.rpc

      events.on('message', async (data: any) => {
        this.log.trace('irc.event.message', JSON.stringify(data))

        switch (data.event) {
          case 'metadata':
            return

          case 'synchronize':
            if (data.keys.length === 0) {
              await this.createClient(id, rpc)
            }
            return
        }

        if (data.event instanceof Array) {
          const key = data.event[0]
          const event = data.event[1]
          if (event === 'registered') {
            const message = data.message
            this.log.trace('irc.event.message.handler', key, event)
            const channel = await this.vars.get('IRC_CHANNEL', '#announce')
            rpc.emit('call', key, 'join', [channel])
          }
        }
      })

      process.on('beforeExit', () => {
        rpc.emit('destroyClient', id)
        resolve()
      })
    })
  }

  private async createClient(id: string, rpc: ApiRpc): Promise<void> {
    const options: ClientOptions = {
      nick: await this.vars.get('IRC_NICK', 'ircwatch'),
      port: await this.vars.as('IRC_PORT', 6667, Converters.num),
      realname: await this.vars.get('IRC_REALNAME', 'IRC Watcher'),
      retryCount: await this.vars.as('IRC_RETRY_COUNT', 32768, Converters.num),
      retryWait: await this.vars.as('IRC_RETRY_WAIT', 5000, Converters.num),
      secure: await this.vars.as('IRC_SECURE', false, Converters.bool),
      server: await this.vars.get('IRC_SERVER', 'irc.xspeeds.eu'),
      user: await this.vars.get('IRC_USER', 'ircwatch'),
    }

    this.log.trace('irc.client.options', JSON.stringify(options))
    rpc.emit('createClient', id, options)
  }
}
