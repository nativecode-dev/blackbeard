declare module 'irc-factory' {
  import * as im from 'irc-message'

  export interface IRCOptions {
    automaticSetup: boolean
    events: string
    fork: boolean
    rpc: string
  }

  export class IRCClient {
    public connection: any
    public key: string
    public options: any
    public supported: any
    constructor(key: string, options: any, socket: any)
  }

  export interface IRCClientOptions {
    nick: string
    port: number
    realname: string
    retryCount: number
    retryWait: number
    secure: boolean
    server: string
    user: string
  }

  export interface IRCMessage extends im.IRCMessage {
    hostname?: string
    nickname?: string
    raw: string
    server?: string
    username?: string
  }

  export class Api {
    public connect(options: IRCOptions): IRCInterfaces
    public emit(event: string, options: any): void
  }

  export type IRCEventCallback = (message: any) => void

  export interface IRCEvents {
    on(event: string, callback: IRCEventCallback): void
  }

  export interface IRCRPC {
    emit(command: string, key: string, argument?: any, ...args: any[]): void
  }

  export interface IRCInterfaces {
    events: IRCEvents
    rpc: IRCRPC
  }
}
