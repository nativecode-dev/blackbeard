import * as cp from 'child_process'
import * as files from '../files'
import * as path from 'path'
import { NPM, Register, Updater, Workspace } from '../registry'
import { UpdateShell } from '../update-shell'

const ScriptName = files.noext(__filename)

const log = files.Logger(ScriptName)

/*
 * Runs each project's build task.
 **/
class Script extends UpdateShell {
  constructor() {
    super(ScriptName)
  }

  public async script(workspace: Workspace): Promise<void> {
    const npm = await files.json<NPM>(workspace.npm)

    return new Promise<void>((resolve, reject) => {
      if (npm.scripts && npm.scripts.build) {
        const command = `cd ${workspace.basepath} && yarn test`
        const child = cp.exec(command)

        child.stderr.pipe(process.stderr)
        child.stdout.pipe(process.stdout)

        log.start('build.start', workspace.name)

        child.addListener('error', error => {
          log.error('build.error', workspace.name)
          reject(error)
        })

        child.addListener('exit', () => {
          log.task('build.done', workspace.name)
          resolve()
        })
      } else {
        log.info(`project [${workspace.name}] does not contain a build script`)
        resolve()
      }
    })
  }
}

Register(ScriptName, new Script())
