import './AppManager.scss'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'inversify-react'

import Container from './inversify.config'

export class AppManager extends React.Component {
  public render() {
    return (
      <Provider container={Container}>
        <div className='appspace'>
          {this.props.children}
        </div>
      </Provider>
    )
  }
}

ReactDOM.render(<AppManager />, document.getElementById('app'))
