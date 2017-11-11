export interface Who {
  channel: string
  raw: string[]
  time: Date
  who: WhoResult[]
}

export interface WhoResult {
  channel: string
  extra: string
  mode: string
  nickname: string
  prefix: string
}
