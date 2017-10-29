import { IRCParserOptions, IRCParserSecrets } from './IRCEntry'
import { Logger, ObjectNavigator } from '../../core'

export class IRCParser {
  private readonly log: Logger
  private readonly options: IRCParserOptions

  constructor(logger: Logger, options: IRCParserOptions) {
    this.log = logger.extend('irc-parser')
    this.options = options
  }

  public parse(text: string): IRCParserRecord {
    this.log.trace('parsing', text)
    const regex = new RegExp(this.options.filtering.pattern, 'g')
    let matches = regex.exec(text)
    const values: string[] = []
    while (matches) {
      this.log.traceJSON(matches)
      values.push(matches[1] || '')
      matches = regex.exec(text)
    }

    const record: IRCParserRecordMap = {}
    values.map((value: string, index: number) => this.format(value, index, record))
    return record as IRCParserRecord
  }

  private format(value: string, index: number, record: IRCParserRecordMap): IRCParserRecordMap {
    const property = this.options.filtering.properties[index]
    const formatter = this.options.formatters[property]
    record[property] = this.secrets(value, this.options.secrets)
    if (formatter && value.match(formatter.regex)) {
      const formatted = record[property] = this.secrets(record[property], this.options.secrets)
      this.log.trace('formatted', property, value, formatted)
    }
    this.log.traceJSON(record)
    return record
  }

  private secrets(value: string, secrets: IRCParserSecrets): string {
    return Object.keys(secrets)
      .reduce((_, name: string): string => {
        let secret = secrets[name]
        if (secret.toLowerCase().startsWith('env.')) {
          const key = secret.replace('env.', '').toUpperCase()
          secret = process.env[key] || value
        }
        this.log.trace('secret', name, secret)
        const regex = new RegExp(`{${name}}`, 'gm')
        return value = value.replace(regex, secret)
      })
  }
}

export interface IRCParserRecord extends IRCParserRecordMap {
  category: string
  title: string
  url: string
}

export interface IRCParserRecordMap {
  [key: string]: string
}
