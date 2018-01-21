import './App.scss'

import * as Browser from '@beard/core.browser'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import Container from './inversify.config'

import { Provider } from 'react-inversify'
import { Movies } from './components'

export class App extends React.Component {
  public render() {
    return (
      <Provider container={Container}>
        <div className='appspace'>
          <Movies />
          {this.props.children}
        </div>
      </Provider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
