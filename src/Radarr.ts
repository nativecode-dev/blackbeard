import { Client } from './Client'
import { Http, HttpMethod, PatchPostPut } from './http'
import { Movie, MovieQuality } from './models/radarr'
import { ILogger, Logger } from './Logger'

export class Radarr extends Client {
  private readonly apikey: string
  private readonly endpoint: string
  private readonly log: ILogger

  constructor(endpoint: string, apikey: string) {
    super()
    this.apikey = apikey
    this.endpoint = endpoint
    this.log = Logger.extend('radarr')
    this.log.debug(`radarr set to use ${endpoint}`)
  }

  public movie(movieId: number): Promise<Movie> {
    return Http<Movie>(`${this.endpoint}/movie/${movieId}`, this.request())
  }

  public movies(): Promise<Movie[]> {
    return Http<Movie[]>(`${this.endpoint}/movie`, this.request())
  }

  public profiles(): Promise<MovieQuality[]> {
    return Http<MovieQuality[]>(`${this.endpoint}/profile`, this.request())
  }

  public async toggleMonitor(movieId: number, toggle: boolean): Promise<void> {
    const movie = await this.movie(movieId)
    movie.monitored = toggle
    await this.update(movie)
    this.log.info(`turned ${this.onoff(toggle)} monitoring for: "${movie.title}" (${movie.year})`)
  }

  public update(movie: Movie): Promise<void> {
    return Http<void>(`${this.endpoint}/movie`, this.request<Movie>(HttpMethod.Put, movie))
  }

  private request<T>(method: HttpMethod = HttpMethod.Get, body?: T): RequestInit {
    return {
      body: PatchPostPut.some(ppp => ppp.toLowerCase() === method.toLowerCase()) ? body : undefined,
      headers: {
        'accept': 'application/json,text/json',
        'content-type': 'application/json',
        'x-api-key': this.apikey,
      },
      method,
    }
  }
}
