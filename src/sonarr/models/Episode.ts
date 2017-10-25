import { EpisodeFile } from './EpisodeFile'

export interface Episode {
  absoluteEpisodeNumber: number
  airDate: Date
  airDateUTC: Date
  episodeFile: EpisodeFile
  episodeNumber: number
  hasFile: boolean
  id: number
  monitored: boolean
  overview: string
  seasonNumber: number
  seriesId: number
  title: string
  unverifiedSceneNumbering: boolean
}
