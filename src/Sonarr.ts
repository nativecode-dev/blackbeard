import { Client, Http, HttpMethod, ILogger, Logger, PatchPostPut } from './core'
import { Episode, QualityProfile, Series, SeriesSeason } from './models/sonarr'

export class Sonarr extends Client {
  private readonly apikey: string
  private readonly endpoint: string
  private readonly log: ILogger

  constructor(endpoint: string, apikey: string) {
    super()
    this.apikey = apikey
    this.endpoint = endpoint
    this.log = Logger.extend('sonarr')
    this.log.debug(`sonarr set to use ${endpoint}`)
  }

  public episodes(seriesId?: number): Promise<Episode[]> {
    if (seriesId) {
      return Http<Episode[]>(`${this.endpoint}/episode?seriesId=${seriesId}`, this.request())
    }
    return Http<Episode[]>(`${this.endpoint}/episode`, this.request())
  }

  public async toggleMonitor(seriesId: number, toggle: boolean): Promise<void> {
    const series = await this.show(seriesId)
    series.monitored = toggle
    await this.update(series)
    this.log.info(`turned ${this.onoff(toggle)} monitoring for: "${series.title}" (${series.year})`)
  }

  public async toggleSeasonMonitor(seriesId: number, seasonNumber: number, toggle: boolean): Promise<void> {
    const series = await this.show(seriesId)
    const season = series.seasons.find(s => s.seasonNumber === seasonNumber)

    if (season) {
      season.monitored = toggle
      await this.update(series)
      this.log.info(`turned ${this.onoff(toggle)} monitoring for: "${series.title}" (${series.year}), season: ${seasonNumber}`)
      return
    }

    throw new Error(`season ${seasonNumber} not found for ${seriesId}`)
  }

  public profiles(): Promise<QualityProfile[]> {
    return Http<QualityProfile[]>(`${this.endpoint}/profile`, this.request())
  }

  public show(seriesId: number): Promise<Series> {
    return Http<Series>(`${this.endpoint}/series/${seriesId}`, this.request())
  }

  public async shows(): Promise<Series[]> {
    const series = await Http<Series[]>(`${this.endpoint}/series`, this.request())
    return series.sort((a, b) => a.sortTitle < b.sortTitle ? -1 : 1)
  }

  public update(series: Series): Promise<void> {
    return Http<void>(`${this.endpoint}/series`, this.request(HttpMethod.Put, series))
  }

  private request<T>(method: HttpMethod = HttpMethod.Get, body?: T): RequestInit {
    return {
      body: PatchPostPut.some(ppp => ppp === method) ? JSON.stringify(body) : undefined,
      headers: {
        'accept': 'application/json,text/json',
        'content-type': 'application/json',
        'x-api-key': this.apikey,
      },
      method,
    }
  }
}
