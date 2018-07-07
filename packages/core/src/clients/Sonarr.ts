import 'reflect-metadata'

import * as fetch from 'node-fetch'
import { inject, injectable } from 'inversify'

import { Logger, LoggerType } from '../logging'
import { Client } from './Client'
import { Environment, EnvironmentType } from '../Environment'
import { ServiceUri } from '../ServiceUri'
import { Episode, QualityProfile, ReleaseInfo, Series } from '../models'

@injectable()
export class Sonarr extends Client {
  private readonly initialized: Promise<ServiceUri>
  private readonly env: Environment

  constructor( @inject(LoggerType) logger: Logger, @inject(EnvironmentType) env: Environment) {
    super(logger)
    this.env = env

    this.initialized = this.init()
  }

  public async episodes(seriesId?: number): Promise<Episode[]> {
    const api = await this.initialized
    if (seriesId) {
      return this.get<Episode[]>(`${api.url}/episode?seriesId=${seriesId}`)
    }
    return this.get<Episode[]>(`${api.url}/episode`)
  }

  public async release(release: ReleaseInfo): Promise<void> {
    const api = await this.initialized
    return this.post<ReleaseInfo, void>(`${api.url}/release/push`, release)
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

  protected async request<T>(body?: T): Promise<fetch.RequestInit> {
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
    const key = await this.env.var('SONARR_APIKEY')
    const url = await this.env.var('SONARR_ENDPOINT', 'http://localhost:8989/api')

    this.log.trace(`set sonarr to ${url}`)
    return { key, url }
  }
}
