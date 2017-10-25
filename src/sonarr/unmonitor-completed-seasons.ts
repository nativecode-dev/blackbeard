import * as fetch from 'node-fetch'
import * as throttler from 'async-throttle'

import { Episode, Series, SeriesSeason } from './models'

const rooturl = 'http://storage.nativecode.local:8989/api'
const throttle = throttler(8)

interface SeasonCompleted {
  seriesId: number
  seasonNumber: number
}

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
const putSeries = async (series: Partial<Series>): Promise<Series> => http<Series>(`${rooturl}/series`, HttpMethod.Put, series)

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
      console.log(`Completed, but still monitoring: ${series.title}, season: ${seasonNumber}.`)
      await update(series.id, { seasonNumber, seriesId })
    }
  }
}

const processSeries = async (series: Series): Promise<void> => {
  const episodes = await getEpisodes(series.id)
  series.seasons.forEach(async season => processSeason(series, season, episodes))
}

const update = async (seriesId: number, completed: SeasonCompleted): Promise<void> => {
  const series = await getSeriesById(seriesId.toString())
  const seasonNumber = completed.seasonNumber
  const season = series.seasons.find(s => s.seasonNumber == seasonNumber)

  if (season) {
    season.monitored = false
    await putSeries(series)
    console.log(`Turned off monitoring for season ${seasonNumber} of ${series.title}.`)
    return
  }

  throw new Error(`Failed to update season ${seasonNumber} for series ${series.id}.`)
}

const main = async (): Promise<void> => {
  const shows = await getSeries()
  await Promise.all(shows.map(series => throttle(async () => processSeries(series))))
}

main()
