import 'reflect-metadata'
import { injectable } from 'inversify'
import { Client, Logger, LoggerFactory, Variables } from './core'
import { Movie, MovieQuality } from './models/radarr'

@injectable()
export class Radarr extends Client implements Radarr {
  private readonly apikey: string
  private readonly endpoint: string

  constructor(logger: LoggerFactory, vars: Variables) {
    super(logger)
    this.apikey = vars.get('RADARR_APIKEY')
    this.endpoint = vars.get('RADARR_ENDPOINT', 'http://localhost:7878/api')
    this.log.trace(`radarr set to use ${this.endpoint}`)
  }

  public movie(movieId: number): Promise<Movie> {
    return this.get<Movie>(`${this.endpoint}/movie/${movieId}`)
  }

  public movies(): Promise<Movie[]> {
    return this.get<Movie[]>(`${this.endpoint}/movie`)
  }

  public page(pageSize: number, start: number = 1): Promise<Movie[]> {
    return this.get<Movie[]>(`${this.endpoint}/movie?page=${start}&pageSize=${pageSize}`)
  }

  public profiles(): Promise<MovieQuality[]> {
    return this.get<MovieQuality[]>(`${this.endpoint}/profile`)
  }

  public async toggleMonitor(movieId: number, toggle: boolean): Promise<void> {
    const movie = await this.movie(movieId)
    movie.monitored = toggle
    await this.update(movie)
    this.log.info(`turned ${this.onoff(toggle)} monitoring for: "${movie.title}" (${movie.year})`)
  }

  public update(movie: Movie): Promise<Movie> {
    return this.put<Movie, Movie>(`${this.endpoint}/movie`, movie)
  }

  protected get name(): string {
    return 'radarr'
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
