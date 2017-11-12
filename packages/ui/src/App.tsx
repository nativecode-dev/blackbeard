import './styles/core.scss'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'inversify-react'

import Container from './inversify.config'
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
