export * from './AppState'
export * from './models'

import { AppState } from './AppState'

export enum AppStateKeys {
  ANYACTION = 'ANYACTION',
  PERFORM_LOGIN = 'PERFORM_LOGIN',
  PERFORM_LOGOUT = 'PERFORM_LOGOUT',
  REQUEST_LOGIN = 'REQUEST_LOGIN',
}

export type AuthAction = PerformLogin | PerformLogout | RequestLogin | AnyAction

export interface AnyAction {
  type: AppStateKeys.ANYACTION
}

export interface PerformLogin {
  email: string
  password: string
  type: AppStateKeys.PERFORM_LOGIN
}

export interface PerformLogout {
  token: string
  type: AppStateKeys.PERFORM_LOGOUT
}

export interface RequestLogin {
  type: AppStateKeys.REQUEST_LOGIN
}

export function appstate(state: AppState, action: AuthAction): AppState {
  switch (action.type) {
    case AppStateKeys.PERFORM_LOGIN:
      return {
        ...state,
        userinfo: {
          ticket: {
            expiration: new Date(),
            token: action.email,
          },
          user: {
            email: action.email,
            name: action.email,
            stats: {},
          }
        }
      }

    case AppStateKeys.PERFORM_LOGOUT:
      return {}

    case AppStateKeys.REQUEST_LOGIN:
      return {}

    default:
      return state
  }
}
