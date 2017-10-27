import 'reflect-metadata'

import { Container, injectable } from 'inversify'
import { Script, ScriptType } from './Script'

@injectable()
export class ScriptFactory {
  private readonly container: Container

  constructor(container: Container) {
    this.container = container
  }

  public get(): Script[] {
    return this.container.getAll<Script>(ScriptType)
  }
}
