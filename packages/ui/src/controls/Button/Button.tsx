import * as React from 'react'
import * as ReactDOM from 'react-dom'

export enum ButtonType {
  Default = 'button',
  Submit = 'submit',
}

export interface ButtonDispatchers {
  click: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export interface ButtonProps {
  text: string
  type: ButtonType
}

export class Button extends React.Component<ButtonProps, ButtonDispatchers> {
  public render() {
    return (
      <button
        className='bb-button'
        onClick={this.state.click}
        type={this.props.type}
      >
        {this.props.text}
      </button>
    )
  }
}
