import 'mocha'

import * as fs from 'fs'
import * as path from 'path'

import container from '../config/inversify.config'
import { expect } from 'chai'
import { Logger, LoggerType } from '../../src/core/logging'
import { IRCParser } from '../../src/modules/IRC'

const json = (filename: string): Promise<any> => {
  const filepath = path.join(process.cwd(), 'tests/artifacts', filename)
  return new Promise<any>((resolve, reject) => {
    fs.exists(filepath, exists => {
      if (exists) {
        fs.readFile(filepath, (error, data) => {
          if (error) reject(error)
          resolve(JSON.parse(data.toString()))
        })
      } else {
        reject(filepath)
      }
    })
  })
}

describe('when parsing IRC messages', () => {
  it('should parse message', async () => {
    const artifact = await json('xspeeds.announce.json')
    const options = await json('xspeeds.parser.json')

    const logger = container.get<Logger>(LoggerType)
    const parser = new IRCParser(logger, options)

    const record = parser.parse(artifact.message.message)
    expect(record.title).to.equal('Eamonn.And.Ruth.S01E01.Do.Dubai.720p.HDTV.x264-BARGE')
  })
})
