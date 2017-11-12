import * as React from 'react'
import * as core from '@beard/core'

export interface MoviesProps {
  visible?: boolean
}

export class Movies extends React.Component<MoviesProps> {
  public render() {
    return (
      <div id='movies'>
        {this.props.children}
      </div>
    )
  }
}
