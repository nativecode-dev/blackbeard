import 'reflect-metadata'

import * as fetch from 'node-fetch'
import { injectable } from 'inversify'
import { DefaultLogger, Logger } from './Logger'

const log: Logger = DefaultLogger.extend('http')

async function Http<T>(url: string, init: RequestInit): Promise<T> {
  log.trace(`sending request to ${url}`, JSON.stringify(init))

  if (init.body) {
    log.trace(JSON.stringify(init.body))
  }

  const request = new fetch.Request(url, init)
  const response = await fetch.default(request)

  if (response.ok) {
    log.trace(`${response.status}:${response.statusText} ${url}`)
    try {
      return await response.json()
    } catch (error) {
      log.error(error)
    }
  }

  throw new Error(`[${response.status}]: ${response.statusText} - Failed to ${init.method} from ${url}`)
}

@injectable()
export abstract class HTTP {
  public delete<TResponse>(url: string): Promise<TResponse> {
    return Http<TResponse>(url, this.init<void>())
  }

  public get<TResponse>(url: string): Promise<TResponse> {
    return Http<TResponse>(url, this.init<void>())
  }

  public post<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
    return Http<TResponse>(url, this.init<TRequest>())
  }

  public put<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
    return Http<TResponse>(url, this.init<TRequest>())
  }

  protected abstract init<TRequest>(body?: TRequest): RequestInit
}
