import 'mocha'

import * as fs from 'fs'
import * as path from 'path'

import container from '../../inversify.config'
import { expect } from 'chai'
import { Logger, LoggerType } from '@blackbeard/core'
import { IRCParser } from '../../modules/IRC'

const artifact = (filename: string): Promise<any> => {
  const filepath = path.join(process.cwd(), 'artifacts', filename)
  return new Promise<any>((resolve, reject) => {
    fs.exists(filepath, exists => {
      if (exists) {
        fs.readFile(filepath, (error, data) => {
          if (error) {
            reject(error)
          } else {
            resolve(JSON.parse(data.toString()))
          }
        })
      } else {
        reject(filepath)
      }
    })
  })
}

describe('when parsing IRC messages', () => {
  it('should parse xspeeds announcements', async () => {
    const announce = await artifact('xspeeds.announce.json')
    const options = await artifact('xspeeds.parser.json')

    const logger = container.get<Logger>(LoggerType)
    const parser = new IRCParser(logger, options)

    const record = parser.parse(announce.message.message)
    expect(record.category).to.equal('TV-HD')
    expect(record.title).to.equal('Eamonn.And.Ruth.S01E01.Do.Dubai.720p.HDTV.x264-BARGE')
  })
})
