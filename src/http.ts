import * as fetch from 'node-fetch'
import { ILogger, Logger } from './Logger'

const log: ILogger = Logger.extend('http')

export enum HttpMethod {
  Get = 'GET',
  Delete = 'DELETE',
  Headers = 'HEAD',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT',
}

export const PatchPostPut: HttpMethod[] = [
  HttpMethod.Patch,
  HttpMethod.Post,
  HttpMethod.Put,
]

export async function Http<T>(url: string, init: RequestInit): Promise<T> {
  log.trace(`sending request to ${url}`)

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
