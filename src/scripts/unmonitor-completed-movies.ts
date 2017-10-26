import { Movie, MovieQuality } from '../models/radarr'
import { Radarr, Script } from '../index'

export class UnmonitorCompletedMovies extends Script {
  private readonly radarr: Radarr

  constructor() {
    super('unmonitor-completed-movies')
    const apikey = process.env.APIKEY_RADARR || ''
    const url = process.env.RADARR_ENDPOINT || 'http://storage.nativecode.local:7878/api'
    this.radarr = new Radarr(url, apikey)
  }

  protected async run(...args: string[]): Promise<void> {
    this.log.info('checking for movies with quality cutoff met')

    try {
      const profiles = await this.radarr.profiles()
      const movies = await this.radarr.movies()

      const profile = (movie: Movie): MovieQuality => profiles.find(p => p.id === movie.profileId) || profiles[0]

      await Promise.all(
        movies.map(async movie => this.throttle(async () => {
          try {
            await this.processMovie(movie, profile(movie))
            this.log.trace(`processed "${movie.title}" (${movie.year}) [${movie.id}]`)
          } catch (error) {
            this.log.error(error)
            this.log.warn(`failed to process "${movie.title}" (${movie.year}) [${movie.id}]: ${error}`)
          }
        }))
      )

      this.log.info('done')
    } catch (error) {
      this.log.error(error)
    }
  }

  private async processMovie(movie: Movie, profile: MovieQuality): Promise<void> {
    if (movie.hasFile && movie.monitored && movie.movieFile.quality.quality.id === profile.cutoff.id) {
      try {
        await this.radarr.toggleMonitor(movie.id, false)
      } catch (error) {
        this.log.error(error)
        throw error
      }
    }
  }
}

new UnmonitorCompletedMovies().start()
