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
  constructor() {
    super(ScriptName)
  }

  public exec(rootpath: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const tsconfigfile = path.join(rootpath, 'tsconfig.json')
      const typesdir = path.join(rootpath, 'node_modules', '@types')

      if (await files.exists(tsconfigfile) && await files.exists(typesdir)) {
        try {
          const tsconfig = await files.json<any>(tsconfigfile)
          const typedirs = await files.listdirs(typesdir)
          const types = typedirs.map(dir => path.basename(dir))
          tsconfig.compilerOptions.types = types.map(type => `@types/${type}`)
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
