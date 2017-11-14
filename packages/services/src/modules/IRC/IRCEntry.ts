import { IRCClientOptions, IRCOptions } from 'irc-factory'

export enum IRCParserClientKind {
  Radarr = 'radarr',
  Sonarr = 'sonarr'
}

export interface IRCEntries {
  [key: string]: IRCEntry
}

export interface IRCEntry {
  api: IRCOptions
  channels: string[]
  connection: IRCClientOptions
  parser: IRCParserOptions
}

export interface IRCParserOptions {
  filtering: IRCParserFiltering
  formatters: IRCParserFormatters
  secrets: IRCParserSecrets
}

export interface IRCParserFiltering {
  category: IRCParserCategories
  pattern: string
  properties: string[]
  username: string
}

export interface IRCParserCategories {
  [key: string]: IRCParserClientKind
}

export interface IRCParserFormatter {
  regex: string
  replace: string
}

export interface IRCParserFormatters {
  [key: string]: IRCParserFormatter
}

export interface IRCParserSecrets {
  [key: string]: string
}
