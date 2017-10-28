import 'reflect-metadata'
import { injectable } from 'inversify'
import { Client, Logger, LoggerFactory, ServiceUri, Variables } from './core'
import { Episode, QualityProfile, Series, SeriesSeason } from './models/sonarr'

@injectable()
export class Sonarr extends Client {
  private readonly initialized: Promise<ServiceUri>
  private readonly vars: Variables

  constructor(logger: LoggerFactory, vars: Variables) {
    super(logger)
    this.vars = vars

    this.initialized = this.init()
  }

  public async episodes(seriesId?: number): Promise<Episode[]> {
    const api = await this.initialized
    if (seriesId) {
      return this.get<Episode[]>(`${api.url}/episode?seriesId=${seriesId}`)
    }
    return this.get<Episode[]>(`${api.url}/episode`)
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

  public async profiles(): Promise<QualityProfile[]> {
    const api = await this.initialized
    return this.get<QualityProfile[]>(`${api.url}/profile`)
  }

  public async show(seriesId: number): Promise<Series> {
    const api = await this.initialized
    return this.get<Series>(`${api.url}/series/${seriesId}`)
  }

  public async shows(): Promise<Series[]> {
    const api = await this.initialized
    const series = await this.get<Series[]>(`${api.url}/series`)
    return series.sort((a, b) => a.sortTitle < b.sortTitle ? -1 : 1)
  }

  public async update(series: Series): Promise<void> {
    const api = await this.initialized
    return this.put<Series, void>(`${api.url}/series`, series)
  }

  protected get name(): string {
    return 'sonarr'
  }

  protected async request<T>(body?: T): Promise<RequestInit> {
    const api = await this.initialized
    return {
      body: JSON.stringify(body),
      headers: {
        'accept': 'application/json,text/json',
        'content-type': 'application/json',
        'x-api-key': api.key,
      },
    }
  }

  private async init(): Promise<ServiceUri> {
    const key = await this.vars.get('SONARR_APIKEY')
    const url = await this.vars.get('SONARR_ENDPOINT', 'http://localhost:8989/api')

    this.log.trace(`set sonarr to ${url}`)
    return { key, url }
  }
}
