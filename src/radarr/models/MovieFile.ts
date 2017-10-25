import { MediaInfo } from '../../models'

export interface MovieFile {
  dateAdded: Date
  id: number
  mediaInfo: MediaInfo  
  movieId: number
  relativePath: string
  size: number
}
