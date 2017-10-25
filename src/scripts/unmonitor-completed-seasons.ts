import * as debug from 'debug'
import { Http, HttpMethod, Throttle, LogDebug, LogError, LogInfo, PatchPutPost } from '../http'
import { Episode, Series, SeriesSeason } from '../models/sonarr'

const Init = (method: HttpMethod = HttpMethod.Get, body: any = undefined): RequestInit => {
  return {
    body: PatchPutPost.some(x => x === method) ? body : undefined,
    headers: {
      'X-Api-Key': process.env.APIKEY_SONARR || '',
      'accept': 'application/json,text/json',
      'content-type': 'application/json'
    },
    method,
  }
}

const RootUrl = process.env.SONARR_ENDPOINT || 'http://storage.nativecode.local:8989/api'

const getSeries = async (): Promise<Series[]> => Http<Series[]>(`${RootUrl}/series`, Init())
const getSeriesById = async (seriesId: string): Promise<Series> => Http<Series>(`${RootUrl}/series/${seriesId}`, Init())
const getEpisodes = async (seriesId: number): Promise<Episode[]> => Http<Episode[]>(`${RootUrl}/episode?seriesId=${seriesId}`, Init())
const putSeries = async (series: Series): Promise<Series> => Http<Series>(`${RootUrl}/series`, Init(HttpMethod.Put, series))

const processSeason = async (series: Series, season: SeriesSeason, episodes: Episode[]): Promise<void> => {
  const key = `${series.id}`
  const seriesId = series.id
  const seasonNumber = season.seasonNumber

  const complete = season.statistics.percentOfEpisodes === 100
  const monitored = seasonNumber > 0 && season.monitored

  if (complete && monitored) {
    const completed = episodes
      .filter(episode => episode.seasonNumber === seasonNumber)
      .every(episode => {
        const seasonMatch = episode.seasonNumber === seasonNumber
        const cutoffMet = episode.episodeFile && episode.episodeFile.qualityCutoffNotMet === false
        return cutoffMet && seasonMatch
      })

    if (completed) {
      LogDebug(`Completed, but still monitoring: ${series.title}, season: ${seasonNumber}.`)
      await disableSeasonMonitor(series.id, seasonNumber)
    }
  }
}

const processSeries = async (series: Series): Promise<void> => {
  const episodes = await getEpisodes(series.id)
  series.seasons.forEach(async season => {
    try {
      await processSeason(series, season, episodes)
    } catch (error) {
      LogError(error)
    }
  })
}

const disableSeasonMonitor = async (seriesId: number, seasonNumber: number): Promise<void> => {
  const series = await getSeriesById(seriesId.toString())
  const logger = debug(`${LogInfo.namespace}:${series.cleanTitle}`)
  const season = series.seasons.find(s => s.seasonNumber == seasonNumber)

  if (season) {
    season.monitored = false
    await putSeries(series)
    logger(`Turned off monitoring for ${series.title}, season ${seasonNumber}.`)
    return
  }

  throw new LogError(`Failed to update season ${seasonNumber} for series ${series.id}.`)
}

export const UnmonitorCompletedSeasons = async (): Promise<void> => {
  LogInfo(`Checking for completed monitored seasons...`)
  const shows = await getSeries()
  await Promise.all(shows.map(series => Throttle(async () => {
    try {
      await processSeries(series)
      LogDebug(`Processed ${series.title} (${series.year}).`)
    } catch (error) {
      LogError(error)
    }
  })))
}

UnmonitorCompletedSeasons()
