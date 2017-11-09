export interface Registration {
  capabilities: Capabilities
  nickname: string

}

export interface NetworkInfo {
  name: string
  hostname: string
  ircd: string
  nicklength: number
  maxtargets: any
}

export interface ChannelInfo {
  idlength: any
  limit: any
  length: number
  modes: number
  types: string
  kicklength: number
  topiclength: number
}

export interface ModeInfo {
  user: string
  channel: string
  param: string
  types: any
  prefixes: string
  prefixmodes: any
  maxlist: any
}

export interface Capabilities {
  network: NetworkInfo
  channel: ChannelInfo
  modes: ModeInfo
  time: Date
  raw: string[]
}
