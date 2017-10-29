import { IRCParserOptions } from './IRCEntry'
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
      values.push(matches[1] || '')
      matches = regex.exec(text)
    }

    this.log.traceJSON(matches)

    const record: IRCParserRecordMap = {}
    values.forEach((value: string, index: number) => {
      const property = this.options.filtering.properties[index]
      const formatter = this.options.formatters[property]
      record[property] = value
      if (formatter) {
        const replaced = value.replace(formatter.regex, formatter.replace)
        const formatted = this.format(replaced, this.options.formatters[property])
        record[property] = formatted
      }
    })

    this.log.traceJSON(record)
    return record as IRCParserRecord
  }

  private format(value: string, values: any): string {
    return Object.keys(values)
      .reduce((_, name: string): string => {
        const regex = new RegExp(`{${name}}`, 'gm')
        const replacement = values[name] as string
        if (replacement && replacement.startsWith(':')) {
          const key = replacement.substring(1)
          return value = value.replace(regex, process.env[key.toUpperCase()] || values)
        }
        return value = value.replace(regex, values[name])
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
