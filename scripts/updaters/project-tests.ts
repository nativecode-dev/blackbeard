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
    log.start('tests.start', workspace.name)

    if (npm.scripts && npm.scripts.test) {
      try {
        await this.run(workspace, 'yarn', 'test')
      } catch (error) {
        this.log.error(error)
      }
    }

    log.done('tests.done', workspace.name)
  }
}

Register(ScriptName, new Script())
