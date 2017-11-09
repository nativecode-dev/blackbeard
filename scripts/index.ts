import './updaters'

import * as files from './files'
import * as path from 'path'
import { Dictionary, GetRegistered, Registered, Updater, Workspace } from './registry'

const scripts = (command: string, ...args: string[]): Updater[] => {
  switch (command.toLowerCase()) {
    case 'all':
      return Registered().map(name => GetRegistered(name))

    case 'list':
      Registered().map(name => console.log(name))
      return []

    default:
      return Registered()
        .filter(name => args.find(value => value === name))
        .map(name => GetRegistered(name))
  }
}

const workspaces = async (): Promise<Workspace[]> => {
  const CONFIGFILES = [
    '.babelrc',
    'tsconfig.json',
    'tslint.json',
  ]

  interface Config extends Dictionary {
    filename: string
    filepath: string
  }

  const packages = await files.listdirs(path.join(process.cwd(), 'packages'))

  const promises = packages.map(async (dir: string): Promise<Workspace> => {
    const available: Config[] = []
    const dirname = path.basename(dir)

    await Promise.all(CONFIGFILES.map(config => path.join(dir, config))
      .map(async configfile => {
        if (await files.exists(configfile)) {
          available.push({
            filename: path.basename(configfile),
            filepath: path.dirname(configfile),
          })
        }
      }))

    const config: any = {}
    available.forEach(c => config[c.filename] = path.join(c.filepath, c.filename))

    return {
      basepath: dir,
      configs: config,
      name: dirname,
      npm: path.join(dir, 'package.json'),
    }
  })

  return Promise.all(promises)
}

const main = async (...args: string[]): Promise<void> => {
  const command = args.length ? args[0] : 'list'

  const promises = scripts(command, ...args)
    .map(async script => {
      const ws = await workspaces()
      return ws.map(async workspace => {
        console.log(`running script [${script.name}] for workspace ${workspace.name}`)
        await script.exec(workspace)
        console.log(`completed script [${script.name}] for workspace ${workspace.name}`)
      })
    })

  await Promise.all(promises)
}

const args = process.argv.slice(2)
main(...args)
