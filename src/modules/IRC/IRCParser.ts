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
    values.map((value: string, index: number) => this.transform(value, index, record))
    return record as IRCParserRecord
  }

  private secret(property: string, value: string, secrets: IRCParserSecrets): string {
    let secret = secrets[property]
    if (secret && secret.toLowerCase().startsWith('env.')) {
      const key = secret.replace('env.', '').toUpperCase()
      secret = process.env[key] || secret
      this.log.trace('replace from env', value, secret)
      return secret
    }
    const regex = new RegExp(`{${property}}`, 'gm')
    secret = value.replace(regex, secret)
    this.log.trace('replace from regex', value, secret)
    return secret
  }

  private transform(value: string, index: number, record: IRCParserRecordMap): IRCParserRecordMap {
    const property = this.options.filtering.properties[index]
    const formatter = this.options.formatters[property]
    if (formatter && formatter.regex) {
      const regex = new RegExp(formatter.regex)
      if (regex.test(value)) {
        const formatted = record[property] = this.secret(property, formatter.replace, this.options.secrets)
        this.log.trace('formatted', value, formatted)
      }
      this.log.traceJSON(record)
    } else {
      record[property] = this.secret(property, value, this.options.secrets)
    }
    return record
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
