import React from 'react'

export class Shows extends React.Component {
  public render() {
    return (
      <div id='shows'>
        {this.props.children}
      </div>
    )
  }
}
