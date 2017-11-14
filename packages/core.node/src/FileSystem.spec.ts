import 'mocha'

import * as path from 'path'
import * as sinon from 'sinon'

import { Logger } from '@beard/core'
import { expect } from 'chai'
import { FileSystem } from './FileSystem'

class TestLogger implements Logger {
  extend(name: string): Logger {
    return this
  }
  // tslint:disable-next-line:no-empty
  debug(...args: any[]): void { }
  // tslint:disable-next-line:no-empty
  debugJSON(object: any): void { }
  // tslint:disable-next-line:no-empty
  error(...args: any[]): void { }
  // tslint:disable-next-line:no-empty
  errorJSON(object: any): void { }
  // tslint:disable-next-line:no-empty
  fatal(...args: any[]): void { }
  // tslint:disable-next-line:no-empty
  fatalJSON(object: any): void { }
  // tslint:disable-next-line:no-empty
  info(...args: any[]): void { }
  // tslint:disable-next-line:no-empty
  infoJSON(object: any): void { }
  // tslint:disable-next-line:no-empty
  silly(...args: any[]): void { }
  // tslint:disable-next-line:no-empty
  sillyJSON(object: any): void { }
  // tslint:disable-next-line:no-empty
  trace(...args: any[]): void { }
  // tslint:disable-next-line:no-empty
  traceJSON(object: any): void { }
  // tslint:disable-next-line:no-empty
  warn(...args: any[]): void { }
  // tslint:disable-next-line:no-empty
  warnJSON(object: any): void { }
}

describe('when accessing the file system', () => {
  it('should read file', async () => {
    const logger = sinon.createStubInstance<Logger>(TestLogger)
    const sut = new FileSystem(logger)
    const pkg = await sut.json<any>(path.join(process.cwd(), 'package.json'))
    expect(pkg.name).to.equal('@beard/core.node')
  })
})
