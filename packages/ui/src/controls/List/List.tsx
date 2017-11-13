import * as React from 'react'
import * as ReactDOM from 'react-dom'

export enum ListType {
  Default = 'list',
  Draggable = 'list-draggable',
  Sortable = 'list-sortable',
}

export interface ListProps<T> {
  items: T[]
  type: ListType
}

export class List<T> extends React.Component<ListProps<T>> {
  public render() {
    return (
      <ul className={this.props.type}>{this.props.items.map(item =>
        <li className='list-item'>
        {item}
        </li>
      )}
      </ul>
    )
  }
}
