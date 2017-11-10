import * as cp from 'child_process'
import { Workspace } from './registry'
import { UpdateScript } from './update-script'

export abstract class UpdateShell extends UpdateScript {
  constructor(name: string) {
    super(name)
  }

  protected run(cwd: string, command: string, ...args: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.log.debug('run', cwd, command, ...args)
      const child = cp.exec(`${command} ${args.join(' ')}`, { cwd }, error => this.log.error(error))
      child.stderr.pipe(process.stderr)
      child.stdout.pipe(process.stdout)
      child.addListener('exit', (code, signal) => {
        if (code === 0) {
          resolve()
        } else {
          reject(signal)
        }
      })
    })
  }
}
