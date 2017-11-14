import './Movies.scss'

import * as Core from '@beard/core'
import * as Browser from '@beard/core.browser'
import * as React from 'react'
import { resolve } from 'inversify-react'
import { Button, ButtonType } from '../../controls'

export interface MoviesProps {
  visible?: boolean
}

export class Movies extends React.Component<MoviesProps> {
  @resolve(Core.Radarr)
  private readonly radarr: Core.Radarr

  public async componentDidMount() {
    this.setState({
      click: event => console.log(event)
    })
  }

  public render() {
    return (
      <div id='movies'>
        <h1>Movies</h1>
        <Button text='click' type={ButtonType.Default} />
        {this.props.children}
      </div>
    )
  }
}
