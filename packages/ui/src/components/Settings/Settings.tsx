import * as React from 'react'

export class Settings extends React.Component {
  public render() {
    return (
      <div id='settings'>
        {this.props.children}
      </div>
    )
  }
}
