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

  private secret(value: string, secrets: IRCParserSecrets): string {
    let result = value
    Object.keys(secrets)
      .map((name: string) => ({ name, value: secrets[name] }))
      .map((secret): string => {
        const regex = new RegExp(`\{${secret.name}\}`, 'gm')
        if (secret.value.toLowerCase().startsWith('env:')) {
          const env = secret.value.replace('env:', '').toUpperCase()
          this.log.trace('secret.regex', secret.name, value, result, env)
          return result.replace(regex, process.env[env] || result)
        }
        return result.replace(regex, result)
      })

    this.log.trace('secret', value, result)
    return result
  }

  private transform(value: string, index: number, record: IRCParserRecordMap): IRCParserRecordMap {
    const property = this.options.filtering.properties[index]
    const formatter = this.options.formatters[property]
    if (formatter && formatter.regex) {
      const regex = new RegExp(formatter.regex)
      if (regex.test(value)) {
        const formatted = record[property] = this.secret(formatter.replace, this.options.secrets)
        this.log.trace('regex', value, formatted)
      }
      this.log.traceJSON(record)
    } else {
      const formatted = record[property] = this.secret(value, this.options.secrets)
      this.log.trace('replace', value, formatted)
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
