import { SeriesStatus, SeriesType } from './enums'
import { Image, Rating } from '../../models'
import { SeriesSeason } from './SeriesSeason'
import { SeriesTitle } from './SeriesTitle'

export interface Series {
  added: Date
  airTime: string
  alternativeTitles: SeriesTitle[]
  certification: string
  cleanTitle: string
  episodeCount: number
  episodeFileCount: number
  firstAired: Date
  genres: string[]
  id: number
  images: Image[]
  imdbId: string
  lastInfoSync: Date
  monitored: boolean
  network: string
  overview: string
  path: string
  previousAiring: Date
  profileId: number
  qualityProfileId: number
  ratings: Rating
  runtime: number
  seriesType: SeriesType
  seasonCount: number
  seasonFolder: string
  seasons: SeriesSeason[]
  sizeOnDisk: number
  sortTitle: string
  status: SeriesStatus
  tags: string[]
  title: string
  titleSlug: string
  tvdbId: number
  tvMazeId: number
  tvRageId: number
  totalEpisodeCount: number
  useSceneNumbering: boolean
  year: number
}
