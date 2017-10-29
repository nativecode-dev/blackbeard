declare module 'irc-factory' {
  import * as cp from 'child_process'
  import * as im from 'irc-message'

  export interface Options {
    automaticSetup: boolean
    events: string
    fork: boolean
    rpc: string
  }

  export class Client {
    public connection: any
    public key: string
    public options: any
    public supported: any
    constructor(key: string, options: any, socket: any)
  }

  export interface ClientOptions {
    nick: string
    port: number
    realname: string
    retryCount: number
    retryWait: number
    secure: boolean
    server: string
    user: string
  }

  export interface Message extends im.IRCMessage {
    hostname?: string
    nickname?: string
    raw: string
    server?: string
    username?: string
  }

  export class Api {
    public connect(options: Options): ApiInterfaces
    public createClient(key: string, object: any, dummy: any): ApiClient
    public destroyClient(key: string): boolean
    public emit(event: string, options: any): void
    public fork(exitCode: number, options: Options): cp.ChildProcess
    public setupServer(options: Options): void
  }

  export interface ApiClient {
    dummy: any
    events: any
    irc: Client
    key: string
    options: any
  }

  export type ApiEventCallback = (message: any) => void

  export interface ApiEvents {
    on(event: string, callback: ApiEventCallback)
  }

  export interface ApiRpc {
    emit(command: string, key: string, argument?: any, ...args: any[]): void
  }

  export interface ApiInterfaces {
    events: ApiEvents
    rpc: ApiRpc
  }
}
