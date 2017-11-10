import * as files from '../files'
import * as path from 'path'
import { NPM, Register, Updater, Workspace } from '../registry'

const ScriptName = files.noext(__filename)
const log = files.Logger(ScriptName)
const prefix = '@types'

/*
 * Updates the "types" property of "tsconfig.json" files by
 * looking for types from @types.
 **/
class Script implements Updater {
  public get name(): string {
    return ScriptName
  }

  public async exec(workspace: Workspace): Promise<void> {
    const tsconfigfile = path.join(workspace.root, 'tsconfig.json')
    const typesdir = path.join(workspace.root, 'node_modules')

    if (await files.exists(tsconfigfile) && await files.exists(typesdir)) {
      const tsconfig = await files.json<any>(tsconfigfile)
      const types = await files.listdirs(typesdir)
      tsconfig.compilerOptions.types = types.map(type => `@types/${type}`)
    }
  }
}

Register(ScriptName, new Script())
