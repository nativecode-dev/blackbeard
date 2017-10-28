import 'reflect-metadata'

import * as fetch from 'node-fetch'
import { injectable } from 'inversify'
import { DefaultLogger, Logger } from './Logger'
import { LoggerFactory } from './LoggerFactory'

@injectable()
export abstract class HTTP {
  private readonly logger: Logger

  constructor(logger: LoggerFactory) {
    this.logger = logger.create(`service:http:${this.name}`)
  }

  public delete<TResponse>(url: string): Promise<TResponse> {
    return this.send<TResponse>(url, this.init<void>(), 'DELETE')
  }

  public get<TResponse>(url: string): Promise<TResponse> {
    return this.send<TResponse>(url, this.init<void>(), 'GET')
  }

  public head<TResponse>(url: string): Promise<TResponse> {
    return this.send<TResponse>(url, this.init<void>(), 'HEAD')
  }

  public patch<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
    return this.send<TResponse>(url, this.init<TRequest>(body), 'PATCH')
  }

  public post<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
    return this.send<TResponse>(url, this.init<TRequest>(body), 'POST')
  }

  public put<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
    return this.send<TResponse>(url, this.init<TRequest>(body), 'PUT')
  }

  protected get log(): Logger {
    return this.logger
  }

  protected abstract get name(): string
  protected abstract init<TRequest>(body?: TRequest): RequestInit

  private async send<T>(url: string, init: RequestInit, method: string = 'GET'): Promise<T> {
    this.log.trace(`sending request to ${url}`, JSON.stringify(init))

    if (init.body) {
      this.log.trace(JSON.stringify(init.body))
    }

    const request = new fetch.Request(url, init)
    const response = await fetch.default(request)

    if (response.ok) {
      this.log.trace(`${response.status}:${response.statusText} ${url}`)
      try {
        return await response.json()
      } catch (error) {
        this.log.error(error)
      }
    }

    throw new Error(`[${response.status}]: ${response.statusText} - Failed to ${init.method} from ${url}`)
  }
}
