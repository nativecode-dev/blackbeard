import 'reflect-metadata'

import container from '../inversify.config'
import * as scripts from './index'
import { Script, ScriptType } from '../core'

const args = process.argv

if (args && args.length) {
  const scriptname = (name: string): boolean => {
    if (args.some(arg => arg.toLowerCase() === 'all')) {
      return true
    }
    return args.find(arg => arg.toLowerCase() === name) !== undefined
  }

  const scripts = container.getAll<Script>(ScriptType)
    .filter(script => scriptname(script.name))

  Promise.all(scripts.map(script => script.start()))
}
