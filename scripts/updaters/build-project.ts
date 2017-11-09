import * as cp from 'child_process'
import * as files from '../files'
import * as path from 'path'
import { NPM, Register, Updater, Workspace } from '../registry'

const ScriptName = files.noext(__filename)

const log = files.Logger(ScriptName)

/*
 * Runs each project's build task.
 **/
class Script implements Updater {
  public get name(): string {
    return ScriptName
  }

  public async exec(workspace: Workspace): Promise<void> {
    const npm = await files.json<NPM>(workspace.npm)
    if (npm.scripts && npm.scripts.build) {
      return new Promise<void>((resolve, reject) => {
        const command = `cd ${workspace.basepath} && yarn build`
        const child = cp.exec(command)

        log.start('build.start', workspace.name)

        child.addListener('error', error => {
          log.error('build.error', workspace.name)
          reject(error)
        })

        child.addListener('exit', () => {
          log.task('build.done', workspace.name)
          resolve()
        })
      })
    }
  }
}

Register(ScriptName, new Script())
