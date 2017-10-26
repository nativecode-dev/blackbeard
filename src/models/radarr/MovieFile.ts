import { MediaInfo, Quality } from '../../models'

export interface MovieFile {
  dateAdded: Date
  id: number
  mediaInfo: MediaInfo
  movieId: number
  quality: Quality
  relativePath: string
  size: number
}
