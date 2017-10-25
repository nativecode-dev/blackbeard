import * as debug from 'debug'
import * as fetch from 'node-fetch'
import * as os from 'os'
import * as throttler from 'async-throttle'

export const Throttle = throttler(os.cpus().length)
export const LogDebug: debug.IDebugger = debug('nativecode:nas-scripts:debug')
export const LogError: debug.IDebugger = debug('nativecode:nas-scripts:error')
export const LogInfo: debug.IDebugger = debug('nativecode:nas-scripts:info')

export enum HttpMethod {
  Get = 'GET',
  Delete = 'DELETE',
  Headers = 'HEADERS',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT',
}

export const PatchPutPost: HttpMethod[] = [
  HttpMethod.Patch,
  HttpMethod.Post,
  HttpMethod.Put,
]

export const Http = async <T>(url: string, init: fetch.RequestInit) => {
  try {
    const request = new fetch.Request(url, init)
    const response = await fetch.default(request)

    switch (response.status) {
      case 200:
      case 201:
      case 202:
        return await response.json() as T

      default:
        throw new LogError(`[${response.status}]: ${response.statusText} - Failed to ${init.method} from ${url}.`)
    }
  } catch (error) {
    LogError(error)
    throw error
  }
}
