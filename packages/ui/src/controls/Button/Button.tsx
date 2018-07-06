import * as React from 'react'
import * as ReactDOM from 'react-dom'

export enum ButtonType {
  Default = 'button',
  Submit = 'submit',
}

export interface ButtonProps {
  text: string
  type: ButtonType
}

export class Button extends React.Component<ButtonProps> {
  public render() {
    return (
      <button className='bb-button' type={this.props.type}>
        {this.props.text}
      </button>
    )
  }
}
