import { Url } from 'url'
import { Dictionary } from '../interfaces/Dictionary'

export interface ProfileSettings {
  connections: Dictionary<Url>
  env: Dictionary<string>
}
