import { Image, Rating } from '../../models'
import { MovieFile } from './MovieFile'
import { MovieTitle } from './MovieTitle'

export enum MovieStatus {
  Released = 'released'
}

export enum PathState {
  Static = 'static'
}

export interface Movie {
  added: Date
  alternativeTitles: MovieTitle[]
  cleanTitle: string
  downloaded: boolean
  folderName: string
  genres: string[]
  hasFile: boolean
  id: number
  images: Image[]
  imdbId: string
  inCinemas: Date
  isAvailable: boolean
  lastInfoSync: Date
  minimumAvailability: boolean
  monitored: boolean
  movieFile: MovieFile
  overview: string
  path: string
  pathState: PathState
  physicalRelease: Date
  profileId: number
  qualityProfileId: number
  ratings: Rating
  runtime: number
  secondaryYearSourceId: number
  sizeOnDisk: number
  sortTitle: string
  status: MovieStatus
  studio: string
  tags: string[]
  title: string
  titleSlug: string
  tmdbId: number
  website: string
  year: number
  youTubeTrailerId: string
}
