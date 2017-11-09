import * as files from '../files'
import * as path from 'path'
import { NPM, Register, Workspace } from '../registry'

const prefix = '@types'

Register('update-package-info', async (workspace: Workspace): Promise<void> => {
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
})
