export class ObjectNavigator {
  private readonly object: any
  private current: any

  constructor(object: any) {
    this.current = this.object = object
  }

  public get keys(): string[] {
    return Object.keys(this.current)
  }

  public context(path: string): any {
    let context = this.current
    return path.split('.')
      .map(part => (context = context[part]))
      .reduce((previous: any, current: any): any => current)
  }

  public value<T>(name: string): T {
    return this.current[name]
  }
}
