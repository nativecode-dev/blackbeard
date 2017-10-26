import * as fetch from 'node-fetch'

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

export async function Http<T>(url: string, init: RequestInit) {
  try {
    const request = new fetch.Request(url, init)
    const response = await fetch.default(request)

    switch (response.status) {
      case 200:
      case 201:
      case 202:
        return await response.json() as T

      default:
        throw new Error(`[${response.status}]: ${response.statusText} - Failed to ${init.method} from ${url}.`)
    }
  } catch (error) {
    throw error
  }
}
