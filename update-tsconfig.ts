import * as path from 'path'

import { exists, listdirs, json } from './src/files'

const typesdir = path.join(process.cwd(), 'node_modules', '@types')

const main = async (...args: string[]): Promise<void> => {
  if (await exists(typesdir)) {
    const typedirs = await listdirs(typesdir)
    const types = typedirs.map(dir => `@types/${path.basename(dir)}`)
    
  }
}

main(...process.argv)
