export type PipelineHandler<T> = (value: T) => T

export class Pipeline<T> {
  private readonly handlers: PipelineHandler<T>[] = []

  constructor(...handlers: PipelineHandler<T>[]) {
    this.handlers = handlers
  }

  public add(handler: PipelineHandler<T>): Pipeline<T> {
    this.handlers.push(handler)
    return this
  }

  public execute(value: T): T {
    return this.pipeline(() => value)(value)
  }

  private pipeline(initiator: PipelineHandler<T>): PipelineHandler<T> {
    return this.handlers.reduce((previous, current) => value => current(previous(value)), initiator)
  }
}
