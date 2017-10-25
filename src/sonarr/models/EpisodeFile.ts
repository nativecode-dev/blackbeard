import { Quality } from './Quality'

export interface EpisodeFile {
  dateAdded: Date
  id: number
  qualityCutoffNotMet: boolean
  path: string
  quality: Quality
  relativePath: string
  sceneName: string
  seasonNumber: number
  seriesId: number
  size: number
}
