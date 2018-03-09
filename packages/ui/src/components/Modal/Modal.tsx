import './Modal.scss'

import * as React from 'react'

export interface IModal {
  cancelText?: string
  confirmText?: string
  title: string
}

export class Modal extends React.Component<IModal> {
  constructor(props: IModal) {
    super(props)
  }

  public render() {
    return (
      <div className='component modal' data-tabindex='-1' role='dialog'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title'>{this.props.title}</h5>
              <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              {this.props.children}
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-primary'>{this.props.confirmText}</button>
              <button type='button' className='btn btn-secondary' data-dismiss='modal'>{this.props.cancelText}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
