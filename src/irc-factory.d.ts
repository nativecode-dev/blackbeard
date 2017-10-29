declare module 'irc-factory' {
  import * as cp from 'child_process'

  export interface Options {
    automaticSetup: boolean
    events: number
    fork: boolean
    rpc: number
  }

  export class Client {
    public connection: any
    public key: string
    public options: any
    public supported: any
    constructor(key: string, options: any, socket: any)
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
    emit(command: string, argument: string, options: any): void
  }

  export interface ApiInterfaces {
    events: any
    rpc: any
  }
}
