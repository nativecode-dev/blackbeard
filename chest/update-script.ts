import * as files from './files'
import * as path from 'path'
import { NPM, Updater, Workspace } from './registry'

export abstract class UpdateScript implements Updater {
  protected readonly log: files.Log
  private readonly _name: string

  constructor(name: string) {
    this._name = name
    this.log = files.Logger(name)
  }

  public get name(): string {
    return this._name
  }

  public exec(workspace: Workspace): Promise<void> {
    return this.script(workspace)
  }

  protected async npm<NPM>(basepath: string): Promise<NPM> {
    const filename = path.join(basepath, 'package.json')

    if (await files.exists(filename)) {
      return await files.json<NPM>(filename)
    }

    throw Error(`could not find 'package.json' in ${basepath}`)
  }

  protected abstract script(workspace: Workspace): Promise<void>
}
