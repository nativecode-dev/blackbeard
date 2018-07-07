export type ChainHandler<T, R> = (value: T, next: ChainHandlerLink<T, R>) => R
export type ChainHandlerLink<T, R> = (value: T) => R
export type ChainHandlers<T, R> = Array<ChainHandler<T, R>>

type Link<T, R> = ChainHandlerLink<T, R>

export class Chain<T, R> {
  private readonly handlers: ChainHandlers<T, R> = []

  public add(handler: ChainHandler<T, R>): Chain<T, R> {
    this.handlers.push(handler)
    return this
  }

  public execute(value: T, initializer: () => R, reverse: boolean = false): R {
    return this.proxy(reverse, initializer)(value)
  }

  private proxy(reverse: boolean, initiator: Link<T, R>): Link<T, R> {
    const handlers = (reverse ? this.handlers.reverse() : this.handlers)

    const proxy = handlers.reduce(
      (previous, current) => (innerValue, innerNext): R => current(innerValue, outerValue => previous(outerValue, innerNext)),
      initiator
    )

    return (object: T) => proxy(object, initiator)
  }
}

export class Chains<T> extends Chain<T, T> { }
