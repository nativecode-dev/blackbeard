import { Dictionary } from '../interfaces/Dictionary'
import { ProfileSettings } from './ProfileSettings'

export interface Profile {
  id: string
  properties: Dictionary<string>
  settings: ProfileSettings
}
