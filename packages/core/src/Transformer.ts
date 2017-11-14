import { Pipeline } from './Pipeline'

export type ArrayTransformer = (array: any[]) => any[]
export type ObjectTransformer = (object: any) => any
export type StringTransformer = (value: string) => string

export abstract class Transformer {
  private readonly arrayTransformer: Pipeline<any[]>
  private readonly objectTransformer: Pipeline<any>
  private readonly stringTransformer: Pipeline<string>

  constructor() {
    this.arrayTransformer = new Pipeline<any[]>()
    this.objectTransformer = new Pipeline<any>()
    this.stringTransformer = new Pipeline<string>()
  }

  public transformArray(value: any[]): any[] {
    return this.arrayTransformer.execute(value)
  }

  public transformObject(value: any): any {
    return this.objectTransformer.execute(value)
  }

  public transformString(value: string): string {
    return this.stringTransformer.execute(value)
  }

  protected array(resolver: ArrayTransformer): void {
    this.arrayTransformer.add(resolver)
  }

  protected object(resolver: ObjectTransformer): void {
    this.objectTransformer.add(resolver)
  }

  protected string(resolver: StringTransformer): void {
    this.stringTransformer.add(resolver)
  }
}
