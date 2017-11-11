import { Movie, MovieQuality, Logger, LoggerType, Radarr } from '@nativecode/blackbeard.core'
import { inject, injectable } from 'inversify'

import { Script } from '../Script'

@injectable()
export class UnMonitorCompletedMovies extends Script {
  private readonly radarr: Radarr

  constructor( @inject(LoggerType) logger: Logger, radarr: Radarr) {
    super(logger)
    this.radarr = radarr
  }

  public get name(): string {
    return 'unmonitor-movies'
  }

  protected async run(...args: string[]): Promise<void> {
    this.log.info('checking for movies where quality cutoff is met')

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
    if (movie.monitored && movie.hasFile && movie.movieFile.quality.quality.id === profile.cutoff.id) {
      try {
        await this.radarr.toggleMonitor(movie.id, false)
      } catch (error) {
        this.log.error(error)
        throw error
      }
    }
  }
}
