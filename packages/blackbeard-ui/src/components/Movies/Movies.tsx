import React from 'react'

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
