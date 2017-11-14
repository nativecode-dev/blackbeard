import { Is } from '@nofrills/types'

export type KeyValueHandler = (mutation: ObjectMutation) => ObjectMutation

export interface ObjectMutation {
  key: string
  original: any
  path: string
  value: any
}

export class ObjectMutator {
  private readonly handler: KeyValueHandler

  constructor(handler: KeyValueHandler) {
    this.handler = handler
  }

  public mutate(object: any, preview: boolean = false, paths: string[] = []): ObjectMutation[] {
    return Object.keys(object)
      .map((key: string): ObjectMutation => ({
        key,
        original: object[key],
        path: paths.join('.'),
        value: object[key],
      }))
      .map((om: ObjectMutation): ObjectMutation => {
        if (preview) {
          return om
        }

        const mutation = this.handler(om)
        object[om.key] = mutation.value

        if (mutation.value && Is.object(mutation.value)) {
          this.mutate(mutation.value, preview, paths.concat(om.key))
        }

        return mutation
      })
  }
}
