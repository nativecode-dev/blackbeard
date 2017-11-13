export type ChainAsyncHandler<T, R> = (value: T, next: ChainAsyncHandlerLink<T, R>) => Promise<R>
export type ChainAsyncHandlerLink<T, R> = (value: T) => Promise<R>
export type ChainAsyncHandlers<T, R> = Array<ChainAsyncHandler<T, R>>

type Handler<T, R> = ChainAsyncHandler<T, R>
type Link<T, R> = ChainAsyncHandlerLink<T, R>

export class ChainAsync<T, R> {
  private readonly handlers: ChainAsyncHandlers<T, R> = []

  constructor(...handlers: ChainAsyncHandlers<T, R>) {
    this.handlers = handlers
  }

  public add(handler: ChainAsyncHandler<T, R>): ChainAsync<T, R> {
    this.handlers.push(handler)
    return this
  }

  public execute(value: T, initializer: () => Promise<R>, reverse: boolean = false): Promise<R> {
    return this.proxy(reverse, initializer)(value)
  }

  private proxy(reverse: boolean, initiator: Link<T, R>): Link<T, R> {
    const handlers = (reverse ? this.handlers.reverse() : this.handlers)

    const proxy = handlers.reduce(
      (previous, current) => (innerValue, innerNext): Promise<R> => current(innerValue, outerValue => previous(outerValue, innerNext)),
      initiator
    )

    return (object: T) => proxy(object, initiator)
  }
}

export class ChainsAsync<T> extends ChainAsync<T, T> { }
