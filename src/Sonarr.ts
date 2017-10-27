import 'reflect-metadata'
import { injectable } from 'inversify'
import { Client, Logger, LoggerFactory, Variables } from './core'
import { Episode, QualityProfile, Series, SeriesSeason } from './models/sonarr'

@injectable()
export class Sonarr extends Client {
  private readonly apikey: string
  private readonly endpoint: string

  constructor(logger: LoggerFactory, vars: Variables) {
    super(logger)
    this.apikey = vars.get('SONARR_APIKEY')
    this.endpoint = vars.get('SONARR_ENDPOINT', 'http://localhost:8989/api')
    this.log.trace(`sonarr set to use ${this.endpoint}`)
  }

  public episodes(seriesId?: number): Promise<Episode[]> {
    if (seriesId) {
      return this.get<Episode[]>(`${this.endpoint}/episode?seriesId=${seriesId}`)
    }
    return this.get<Episode[]>(`${this.endpoint}/episode`)
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
    return this.get<QualityProfile[]>(`${this.endpoint}/profile`)
  }

  public show(seriesId: number): Promise<Series> {
    return this.get<Series>(`${this.endpoint}/series/${seriesId}`)
  }

  public async shows(): Promise<Series[]> {
    const series = await this.get<Series[]>(`${this.endpoint}/series`)
    return series.sort((a, b) => a.sortTitle < b.sortTitle ? -1 : 1)
  }

  public update(series: Series): Promise<void> {
    return this.put<Series, void>(`${this.endpoint}/series`, series)
  }

  protected get name(): string {
    return 'sonarr'
  }

  protected init<T>(body?: T): RequestInit {
    return {
      body: JSON.stringify(body),
      headers: {
        'accept': 'application/json,text/json',
        'content-type': 'application/json',
        'x-api-key': this.apikey,
      },
    }
  }
}
