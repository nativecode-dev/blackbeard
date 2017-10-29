export * from './Radarr'
export * from './Sonarr'
export { Script } from './core'

import container from './inversify.config'
import * as cluster from 'cluster'
import * as path from 'path'
import * as core from './core'
import * as modules from './modules'

const SHUTDOWN = -1024

function main(command: string): Promise<void> {
  switch (command || process.env.APPCMD) {
    case 'ircwatch':
      return container.get<modules.IRCFactory>(modules.IRCFactory).start()

    case 'scheduler':
      return container.get<core.Scheduler>(core.Scheduler).start()
  }

  return Promise.reject('did not pass valid startup parameter')
}

if (cluster.isMaster) {
  console.log(`forking ${process.argv[1]}`)
  const worker = cluster.fork()
  worker.on('exit', (code: number, signal: string) => {
    /**
     * Crash protection is enabled by default, so if the
     * app dies it will be restarted. However, to escape
     * the crash protecion loop, return an exit code of
     * "-1024" or fire a SIGNTERM.
     */
    if (code !== SHUTDOWN || signal !== 'SIGTERM') {
      console.log(`forking due to ${code}:${signal}`)
      cluster.fork()
    }
  })
} else {
  main.apply(process, process.argv.slice(2))
    .catch((error: Error) => console.log(error))
    .then(() => process.exit(SHUTDOWN))
}
