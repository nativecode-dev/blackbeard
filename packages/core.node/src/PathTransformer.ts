import * as os from 'os'
import * as path from 'path'
import { Is } from '@nofrills/types'

import { ObjectMutator, ObjectMutation, Transformer } from '@beard/core'

export class PathTransformer extends Transformer {
  private readonly mutator: ObjectMutator

  constructor() {
    super()
    this.mutator = new ObjectMutator(value => this.mutate(value))
    this.string(value => this.env(value))
    this.string(value => this.home(value))
  }

  public transformObject(value: any): any {
    this.mutator.mutate(value)
    return value
  }

  private env(value: string): string {
    if (value) {
      const parts = value.split(':')
      if (parts.length && parts[0].toLowerCase() === 'env') {
        const envname = parts[1].toUpperCase()
        if (parts.length > 2) {
          switch (parts[2]) {
            case '+': return path.join(process.env[envname] || value, parts[2])
            default: return [process.env[envname] || value, parts[2]].join('')
          }
        }
        return process.env[envname] || value
      }
    }
    return value
  }

  private home(value: string): string {
    if (value && value[0] === '~') {
      const index = value[1] === '/' ? 2 : 1
      return path.join(os.homedir(), value.substring(index))
    }
    return value
  }

  private mutate(mutation: ObjectMutation): ObjectMutation {
    if (Is.string(mutation.value)) {
      mutation.value = this.transformString(mutation.value)
    }
    return mutation
  }
}
