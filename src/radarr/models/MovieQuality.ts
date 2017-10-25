import { QualityType } from '../../models'
import { MovieQualityType } from './MovieQualityType'

export interface MovieQuality {
  cutoff: QualityType
  id: number
  items: MovieQualityType[]
  language: string
  name: string
  preferredTags: string
}
