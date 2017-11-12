import './styles/core.scss'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Movies } from './components'

export default class App extends React.Component {
  public render() {
    return (
      <div className='appspace'>
        <Movies />
        {this.props.children}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
