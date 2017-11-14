import { Profile } from './Profile'

export interface ProfileManager {
  load(id: string): Promise<Profile>
  save(profile: Profile): Promise<void>
}
