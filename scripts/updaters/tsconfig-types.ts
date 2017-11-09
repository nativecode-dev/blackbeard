import * as files from '../files'
import * as path from 'path'
import { NPM, Register, Updater, Workspace } from '../registry'

const prefix = '@types'

class Script implements Updater {
  public get name(): string {
    return 'tsconfig-types'
  }

  public async exec(workspace: Workspace): Promise<void> {
    const tsconfigfile = workspace.configs['tsconfig.json']

    if (tsconfigfile) {
      const tsconfig = await files.json<any>(tsconfigfile)
      const npm = await files.json<NPM>(workspace.npm)

      if (npm.devDependencies) {
        const packages = Object.keys(npm.devDependencies)
          .filter(name => name.substring(0, prefix.length) === prefix)

        if (packages && packages.length) {
          tsconfig.compilerOptions.types = packages
          files.save(tsconfigfile, tsconfig)
          console.log(`updated ${tsconfigfile} types`)
        }
      }
    }
  }
}

Register('tsconfig-types', new Script())
