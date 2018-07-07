import 'mocha'

import * as path from 'path'

import { expect } from 'chai'
import { FileSystem } from './FileSystem'

describe('when accessing the file system', () => {
  it('should read file', async () => {
    const sut = new FileSystem()
    const pkg = await sut.json<any>(path.join(process.cwd(), 'package.json'))
    expect(pkg.name).to.equal('@beard/core.node')
  })
})
