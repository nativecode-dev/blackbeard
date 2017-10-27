export * from './UnMonitorCompletedMovies'
export * from './UnMonitorCompletedSeasons'

import 'reflect-metadata'

import container from '../inversify.config'
import * as scripts from './index'
import { Script, ScriptType } from '../core'

const args = process.argv

if (args && args.length) {
  const scriptname = (name: string): string => {
    return args.find(scriptname => scriptname.toLowerCase() === name) || ''
  }

  const scripts = container.getAll<Script>(ScriptType)
    .filter(script => scriptname(script.name))

  Promise.all(scripts.map(script => script.start()))
}
