import * as debug from 'debug'
import * as fetch from 'node-fetch'
import * as os from 'os'
import * as throttler from 'async-throttle'

import { Episode, Series, SeriesSeason } from './models'

const rooturl = process.env.SONARR_ENDPOINT || 'http://storage.nativecode.local:8989/api'
const throttle = throttler(os.cpus().length)
const log: debug.IDebugger = debug('nativecode:nas-scripts')

enum HttpMethod {
  Get = 'GET',
  Delete = 'DELETE',
  Headers = 'HEADERS',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT',
}

const PatchPutPost: HttpMethod[] = [
  HttpMethod.Patch,
  HttpMethod.Post,
  HttpMethod.Put,
]

const http = async <T>(url: string, method: HttpMethod = HttpMethod.Get, body: any = {}) => {
  const options: fetch.RequestInit = {
    body: PatchPutPost.some(x => x === method) ? JSON.stringify(body) : undefined,
    headers: {
      'X-Api-Key': process.env.APIKEY_SONARR || '',
      'accept': 'application/json,text/json',
      'content-type': 'application/json'
    },
    method,
  }
  const request = new fetch.Request(url, options)
  const response = await fetch.default(request)

  switch (response.status) {
    case 200:
    case 201:
    case 202:
      return await response.json() as T

    default:
      throw new Error(`[${response.status}]: ${response.statusText} - Failed to ${method} from ${url}.`)
  }
}

const getSeries = async (): Promise<Series[]> => http<Series[]>(`${rooturl}/series`)
const getSeriesById = async (seriesId: string): Promise<Series> => http<Series>(`${rooturl}/series/${seriesId}`)
const getEpisodes = async (seriesId: number): Promise<Episode[]> => http<Episode[]>(`${rooturl}/episode?seriesId=${seriesId}`)
const putSeries = async (series: Series): Promise<Series> => http<Series>(`${rooturl}/series`, HttpMethod.Put, series)

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
      log(`Completed, but still monitoring: ${series.title}, season: ${seasonNumber}.`)
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
      log(error)
    }
  })
}

const disableSeasonMonitor = async (seriesId: number, seasonNumber: number): Promise<void> => {
  const series = await getSeriesById(seriesId.toString())
  const logger = debug(`${log.namespace}:${series.cleanTitle}`)
  const season = series.seasons.find(s => s.seasonNumber == seasonNumber)

  if (season) {
    season.monitored = false
    await putSeries(series)
    logger(`Turned off monitoring for ${series.title}, season ${seasonNumber}.`)
    return
  }

  throw new Error(`Failed to update season ${seasonNumber} for series ${series.id}.`)
}

export const UnmonitorCompletedSeasons = async (): Promise<void> => {
  log(`Checking for completed monitored seasons, throttled to ${os.cpus().length}...`)
  const shows = await getSeries()
  await Promise.all(shows.map(series => throttle(async () => {
    try {
      log(`Processing ${series.title} (${series.year})...`)
      await processSeries(series)
      log(`Processed ${series.title} (${series.year}).`)
    } catch (error) {
      log(error)
    }
  })))
}

UnmonitorCompletedSeasons()
