import { QualityProfile } from './QualityProfile'
import { QualityType } from './QualityType'

export interface Profile {
  cutoff: QualityType
  id: number
  items: QualityProfile[]
  language: string
  name: string
}
