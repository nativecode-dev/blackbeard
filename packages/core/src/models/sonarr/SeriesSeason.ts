import { SeriesStatistics } from './SeriesStatistics'

export interface SeriesSeason {
  monitored: boolean
  seasonNumber: number
  statistics: SeriesStatistics
}
