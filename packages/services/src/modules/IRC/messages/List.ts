export interface List {
  limit: number
  list: ListResult[]
  page: number
  raw: string[]
  time: Date
  search: string
}

export interface ListResult {
  channel: string
  topic: string
  users: string
}
