import { Episode, Series, SeriesSeason } from '../models/sonarr'
import { Script, Sonarr } from '../index'

export class UnmonitorCompletedSeasons extends Script {
  private readonly sonarr: Sonarr

  constructor() {
    super('unmonitor-completed-seasons')
    const apikey = process.env.APIKEY_SONARR || ''
    const url = process.env.SONARR_ENDPOINT || 'http://storage.nativecode.local:8989/api'
    this.sonarr = new Sonarr(url, apikey)
  }

  protected async run(...args: string[]): Promise<void> {
    this.log.info('checking for seasons with quality cutoff met...')

    try {
      const shows = await this.sonarr.shows()

      await Promise.all(shows.map(series => this.throttle(async () => {
        try {
          await this.processSeries(this.sonarr, series)
          this.log.trace(`processed "${series.title}" (${series.year}).`)
        } catch (error) {
          this.log.error(error)
        }
      })))

      this.log.info('done.')
    } catch (error) {
      this.log.error(error)
    }
  }

  private async processSeason(sonarr: Sonarr, series: Series, season: SeriesSeason, episodes: Episode[]): Promise<void> {
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
        await sonarr.toggleSeasonMonitor(seriesId, seasonNumber, false)
      }
    }
  }

  private async processSeries(sonarr: Sonarr, series: Series): Promise<void> {
    const episodes = await sonarr.episodes(series.id)
    series.seasons.forEach(async season => {
      try {
        await this.processSeason(sonarr, series, season, episodes)
      } catch (error) {
        this.log.error(error)
      }
    })
  }
}

new UnmonitorCompletedSeasons().start()
