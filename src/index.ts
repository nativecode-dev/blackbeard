export * from './Radarr'
export * from './Sonarr'
export { Script } from './core'

import container from './inversify.config'
import * as path from 'path'
import * as core from './core'
import * as modules from './modules'

function main(command: string): Promise<void> {
  switch (command || process.env.APPCMD) {
    case 'ircwatch':
      return container.get<modules.IrcFactory>(modules.IrcFactory).start()

    case 'scheduler':
      return container.get<core.Scheduler>(core.Scheduler).start('nas-schedule.json')
  }

  return Promise.reject('did not pass valid startup parameter')
}

main.apply(process, process.argv.slice(2))
