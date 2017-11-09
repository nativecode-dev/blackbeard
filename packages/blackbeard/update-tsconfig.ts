import * as path from 'path'

import { exists, listdirs, json, save } from './src/files'

const packagefile = path.join(process.cwd(), 'package.json')

const tsconfigfiles = [
  path.join(process.cwd(), 'tsconfig.json'),
]

const typesdir = path.join(process.cwd(), 'node_modules', '@types')

const update = async (filepath: string, types: string[]): Promise<void> => {
  const tsconfig = await json<any>(filepath)
  tsconfig.compilerOptions.types = types
  await save<any>(filepath, tsconfig)
  console.log('updated', path.relative(process.cwd(), filepath))
}

const main = async (...args: string[]): Promise<void> => {
  if (await exists(typesdir)) {
    const typedirs = await listdirs(typesdir)

    const types = typedirs
      .map(typedir => path.basename(typedir))
      .map(typedir => `@types/${typedir}`)

    await Promise.all(
      tsconfigfiles.map(async tsconfigfile => await update(tsconfigfile, types))
    )
  }
}

main(...process.argv)
