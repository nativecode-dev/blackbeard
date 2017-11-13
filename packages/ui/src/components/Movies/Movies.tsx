import './Movies.scss'

import * as Core from '@beard/core'
import * as React from 'react'
import { resolve } from 'inversify-react'

export interface MoviesProps {
  visible?: boolean
}

export class Movies extends React.Component<MoviesProps> {
  @resolve(Core.Radarr)
  private readonly radarr: Core.Radarr

  public async componentDidMount() {
    const movies = await this.radarr.movies()
    this.setState(movies)
  }

  public render() {
    return (
      <div id='movies'>
        {this.props.children}
      </div>
    )
  }
}
