import * as fetch from 'node-fetch'
import { Http, HttpMethod, LogDebug, LogError, LogInfo, PatchPutPost, Throttle } from '../http'

import { Movie, MovieQuality } from './models'

const Init = (method: HttpMethod = HttpMethod.Get, body: any = undefined): fetch.RequestInit => {
  return {
    body: PatchPutPost.some(x => x === method) ? body : undefined,
    headers: {
      'X-Api-Key': process.env.APIKEY_RADARR || '',
      'accept': 'application/json,text/json',
      'content-type': 'application/json'
    },
    method,
  }
}

const RootUrl = 'http://storage.nativecode.local:7878/api'

const getMovies = () => Http<Movie[]>(`${RootUrl}/movie`, Init())
const getProfiles = () => Http<MovieQuality[]>(`${RootUrl}/profile`, Init())

const processMovie = (movie: Movie, profile: MovieQuality): Promise<void> => {
  if (movie.hasFile && movie.monitored && movie.qualityProfileId === profile.cutoff.id) {
    LogDebug(`Monitored, but cutoff quality already met. ${movie.title}`)
  }

  return Promise.resolve()
}

export const UnmonitorCompletedMovies = async (): Promise<void> => {
  LogInfo(`Checking for completed monitored movies...`)
  const profiles = await getProfiles()
  const movies = await getMovies()

  const profile = (movie: Movie): MovieQuality => profiles.find(p => p.id === movie.profileId) || profiles[0]

  await Promise.all(
    movies.map(async movie => Throttle(async () => await processMovie(movie, profile(movie))))
  )
}

UnmonitorCompletedMovies()
