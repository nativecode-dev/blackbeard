import './App.scss'
import 'bootstrap'

import * as app from './appstate'
import * as favicon from './assets/favicon.png'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import container from './inversify.config'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { ILogin, Login, Modal } from './components'

export class App extends React.Component {
  public render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <Provider store={createStore<app.AppState>(app.appstate, {})}>
          <Login />
        </Provider>
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
