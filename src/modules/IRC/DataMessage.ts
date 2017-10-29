export interface DataBody {
  hostname: string
  message: string
  nickname: string
  raw: string
  target: string
  time: Date
  username: string
}

export interface DataMessage {
  event: string | string[]
  keys: string[]
  body: DataBody
  username: string
}
