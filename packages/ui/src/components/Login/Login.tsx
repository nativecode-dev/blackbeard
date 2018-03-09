import './Login.scss'

import * as React from 'react'
import * as State from '../../appstate'

import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

export interface ILogin {
  email: string
  password: string
  user?: State.UserInfo
}

export interface ILoginProps {
}

export class Login extends React.Component<ILoginProps, ILogin> {
  private static readonly NO_CREDENTIALS = { email: '', password: '' }

  constructor(props: ILoginProps) {
    super(props)
    this.state = { ...Login.NO_CREDENTIALS }
  }

  public render() {
    return (
      <div>
        <div>
          <TextField name='email' type='text' hintText='account email' onChange={this.email}></TextField>
        </div>
        <div>
          <TextField name='password' type='password' hintText='account password' onChange={this.password}></TextField>
        </div>
        <div>
          <FlatButton label='Login' primary={true} onClick={this.login}></FlatButton>
          <FlatButton label='Cancel' onClick={this.reset}></FlatButton>
        </div>
      </div>
    )
  }

  private readonly email = (email: string): string => {
    if (email) {
      this.setState({ email })
    }
    return this.state.email
  }

  private readonly password = (password: string): string => {
    if (password) {
      this.setState({ password })
    }
    return this.state.password
  }

  private readonly login = () => {
    if (this.state.email && this.state.password) {
      const ticket = this.createTicket(this.state.email)
      const user = this.createUser(ticket)
      this.setState({ user })
    } else {
      this.setState(Login.NO_CREDENTIALS)
    }
  }

  private readonly reset = () => {
    this.setState(Login.NO_CREDENTIALS)
  }

  private createTicket(email: string): State.AuthorizationTicket {
    return {
      expiration: new Date(),
      token: email,
    }
  }

  private createUser(ticket: State.AuthorizationTicket): State.UserInfo {
    return {
      ticket,
      user: {
        email: this.state.email,
        name: this.state.email,
        stats: {},
      }
    }
  }
}
