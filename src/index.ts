export * from './Radarr'
export * from './Sonarr'
export { Script } from './core'

import container from './inversify.config'
import * as cluster from 'cluster'
import * as path from 'path'
import * as core from './core'
import * as modules from './modules'

const SHUTDOWN = -1024

async function main(command: string): Promise<void> {
  command = command || process.env.APPCMD || ''
  console.log('running', command)
  switch (command) {
    case 'ircwatch':
      await container.get<modules.IRCWatcher>(modules.IRCWatcher).start()
      process.exit(0)
      break

    case 'scheduler':
      await container.get<modules.Scheduler>(modules.Scheduler).start()
      process.exit(0)
      break

    default:
      console.log(`invalid parameter provided: "${command}"`)
      process.exit(-1)
      break
  }
}

if (cluster.isMaster) {
  const createWorker = (): cluster.Worker => {
    return cluster.fork()
      .on('exit', (code: number, signal: string) => {
        /**
         * Crash protection is enabled by default, so if the
         * app dies it will be restarted. However, to escape
         * the crash protecion loop, return an exit code of
         * "-1024" or fire a SIGNTERM.
         */
        if (code !== 0 && (code !== SHUTDOWN || signal !== 'SIGTERM')) {
          console.log(`forking due to ${code}:${signal}`)
          createWorker()
        }
      })
  }

  console.log(`forking ${process.argv[1]} ${process.argv.slice(2).join(' ')}`)
  createWorker()
} else {
  main.apply(process, process.argv.slice(2))
    .catch((error: Error) => console.log(error))
    .then(() => process.exit(SHUTDOWN))
}
