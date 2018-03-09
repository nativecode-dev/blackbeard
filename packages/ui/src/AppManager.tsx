import './AppManager.scss'

import * as app from './appstate'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import container from './inversify.config'

import { Provider } from 'react-redux'
import { createStore } from 'redux'

export class AppManager extends React.Component {
  public render() {
    return (
      <Provider store={createStore<app.AppState>(app.appstate, {})}>
        <div className='appspace'>
          {this.props.children}
        </div>
      </Provider>
    )
  }
}

ReactDOM.render(<AppManager />, document.getElementById('app'))
