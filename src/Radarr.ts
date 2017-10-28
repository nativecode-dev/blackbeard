import 'reflect-metadata'
import { injectable } from 'inversify'
import { Client, Logger, LoggerFactory, ServiceUri, Variables } from './core'
import { Movie, MovieQuality } from './models/radarr'

@injectable()
export class Radarr extends Client implements Radarr {
  private readonly initialized: Promise<ServiceUri>
  private readonly vars: Variables

  constructor(logger: LoggerFactory, vars: Variables) {
    super(logger)
    this.vars = vars
    this.initialized = this.init()
  }

  public async movie(movieId: number): Promise<Movie> {
    const api = await this.initialized
    return this.get<Movie>(`${api.url}/movie/${movieId}`)
  }

  public async movies(): Promise<Movie[]> {
    const api = await this.initialized
    return this.get<Movie[]>(`${api.url}/movie`)
  }

  public async page(pageSize: number, start: number = 1): Promise<Movie[]> {
    const api = await this.initialized
    return this.get<Movie[]>(`${api.url}/movie?page=${start}&pageSize=${pageSize}`)
  }

  public async profiles(): Promise<MovieQuality[]> {
    const api = await this.initialized
    return this.get<MovieQuality[]>(`${api.url}/profile`)
  }

  public async toggleMonitor(movieId: number, toggle: boolean): Promise<void> {
    const movie = await this.movie(movieId)
    movie.monitored = toggle
    await this.update(movie)
    this.log.info(`turned ${this.onoff(toggle)} monitoring for: "${movie.title}" (${movie.year})`)
  }

  public async update(movie: Movie): Promise<Movie> {
    const api = await this.initialized
    return this.put<Movie, Movie>(`${api.url}/movie`, movie)
  }

  protected get name(): string {
    return 'radarr'
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
    const key = await this.vars.get('RADARR_APIKEY')
    const url = await this.vars.get('RADARR_ENDPOINT', 'http://localhost:7878/api')

    this.log.trace(`set radarr to ${url}`)
    return { key, url }
  }
}
