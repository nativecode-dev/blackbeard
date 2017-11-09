import './app.html'
import './styles/core.scss'

import React from 'react'
import ReactDOM from 'react-dom'

import { Movies } from './components'

export class App extends React.Component {
  public render() {
    return (
      <div className='appspace'>
        {this.props.children}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
