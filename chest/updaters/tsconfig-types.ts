import * as files from '../files'
import * as path from 'path'
import { NPM, Register, Updater, Workspace } from '../registry'
import { UpdateScript } from '../update-script'

const ScriptName = files.noext(__filename)
const log = files.Logger(ScriptName)
const prefix = '@types'

/*
 * Updates the "types" property of "tsconfig.json" files by
 * looking for types from @types.
 **/
class Script extends UpdateScript {
  private promise: Promise<void>

  constructor() {
    super(ScriptName)
  }

  public script(workspace: Workspace): Promise<void> {
    return this.promise ? this.promise : new Promise<void>(async (resolve, reject) => {
      const tsconfigfile = path.join(workspace.root, 'tsconfig.json')
      const typesdir = path.join(workspace.root, 'node_modules', '@types')

      if (await files.exists(tsconfigfile) && await files.exists(typesdir)) {
        try {
          const tsconfig = await files.json<any>(tsconfigfile)
          const typedirs = await files.listdirs(typesdir)
          const types = typedirs.map(dir => path.basename(dir))
          tsconfig.compilerOptions.types = types.map(type => `@types/${type}`).concat(['@blackbeard/core'])
          await files.save(tsconfigfile, tsconfig)
          this.log.task('updated', tsconfigfile)
          resolve()
        } catch (error) {
          reject(error)
        }
      }
    })
  }
}

Register(ScriptName, new Script())
