export interface Links {
  links: LinkResult[]
  raw: string[]
  time: Date
}

export interface LinkResult {
  description: string
  link: string
  server: string
}
