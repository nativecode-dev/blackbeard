import container from './inversify.config'

import * as cluster from 'cluster'
import * as path from 'path'
import * as core from '@nativecode/blackbeard.core'
import * as server from '@nativecode/blackbeard.core.node'
import * as modules from './modules'

async function main(command: string): Promise<void> {
  command = (command || process.env.APPCMD || '').toLowerCase()
  console.log('running', command)
  const mods = container.getAll<server.Module>(server.ModuleType)
  const mod = mods.find(m => m.name === command)
  if (mod) {
    await mod.start()
    process.exit(0)
  } else {
    console.log('error', `invalid parameter provided: "${command}"`)
    process.exit(-1)
  }
}

if (cluster.isMaster) {

  const createWorker = (): cluster.Worker => {
    return cluster.fork()
      .on('exit', (code: number, signal: string) => {
        /**
         * Crash protection is enabled by default, so if the
         * app dies it will be restarted. Postive code values
         * will restart the application while negative code
         * values will exit all processes.
         */
        if (code > 0 && signal !== 'SIGTERM') {
          console.log('fork', `${code}:${signal}`)
          createWorker()
        }
      })
  }
  console.log(`${process.argv[1]} ${process.argv.slice(2).join(' ')}`)
  createWorker()

} else {

  main.apply(process, process.argv.slice(2))
    .catch((error: Error) => console.log(error))
    .then(() => process.exit(5150))

}
