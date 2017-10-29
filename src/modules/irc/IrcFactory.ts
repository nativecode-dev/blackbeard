import 'reflect-metadata'

import { Api, Options } from 'irc-factory'
import { injectable } from 'inversify'
import { Variables } from '../../core'

@injectable()
export class IrcFactory {
  private readonly vars: Variables

  constructor(vars: Variables) {
    this.vars = vars
  }

  public start(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const options: Options = {
        automaticSetup: Boolean(await this.vars.get('IRC_CONFIG_AUTOSTART', 'true')),
        events: Number(await this.vars.get('IRC_CONFIG_EVENTS', '31920')),
        fork: Boolean(await this.vars.get('IRC_CONFIG_FORK', 'true')),
        rpc: Number(await this.vars.get('IRC_CONFIG_RPC', '31930')),
      }

      const api = new Api()
      const interfaces = api.connect(options)

      const events = interfaces.events
      const rpc = interfaces.rpc

      events.on('message', (message: any) => {
        if (message.event === 'synchronize') {
          if (message.keys.length === 0) {
            setTimeout(async () => await this.createClient(rpc), 1500)
          }
          return
        }
      })

      events.on('disconnect', () => resolve())
    })
  }

  private async createClient(rpc: any): Promise<void> {
    rpc.emit('createClient', 'test', {
      nick: await this.vars.get('IRC_NICK', 'irc-watch'),
      user: await this.vars.get('IRC_USER', 'dryploefo'),
      server: await this.vars.get('IRC_SERVER', 'localhost'),
      realname: await this.vars.get('IRC_REALNAME', 'irc-watch'),
      port: Number(await this.vars.get('IRC_PORT', '6667')),
      secure: Boolean(await this.vars.get('IRC_SECURE', 'false')),
      retryCount: Number(await this.vars.get('IRC_RETRY_COUNT', '2')),
      retryWait: Number(await this.vars.get('IRC_RETRY_WAIT', '3000')),
    })
  }
}
