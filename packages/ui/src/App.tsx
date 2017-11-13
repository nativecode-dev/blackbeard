import './App.scss'

import * as Browser from '@beard/core.browser'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'inversify-react'

import Container from './inversify.config'
import { Movies } from './components'

export class App extends React.Component {
  private window: Browser.BrowserWindow

  public componentDidMount() {
    this.window = window
    this.window.env = {
      RADARR_APIKEY: '01debb27924a4fefb458304a0f035973',
      RADARR_ENDPOINT: 'http://storage.nativecode.local:7878/api',
      SONARR_APIKEY: '7bc5c3b191584491a6ec125a19e2b2e8',
      SONARR_ENDPOINT: 'http://storage.nativecode.local:8989/api',
      XSPEEDS_APIKEY: 'ee25f743044e7ac24c2afbe32354f327',
    }
  }

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
