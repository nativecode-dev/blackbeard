export type PipelineAsyncHandler<T> = (value: T) => Promise<T>

export class PipelineAsync<T> {
  private readonly handlers: PipelineAsyncHandler<T>[] = []

  constructor(...handlers: PipelineAsyncHandler<T>[]) {
    this.handlers = handlers
  }

  public add(handler: PipelineAsyncHandler<T>): PipelineAsync<T> {
    this.handlers.push(handler)
    return this
  }

  public execute(value: T): Promise<T> {
    return this.pipeline(() => Promise.resolve(value))(value)
  }

  private pipeline(initiator: PipelineAsyncHandler<T>): PipelineAsyncHandler<T> {
    return this.handlers.reduce((previous, current) => async value => current(await previous(value)), initiator)
  }
}
