import { AuthorizationTicket } from './AuthorizationTicket'
import { User } from './User'

export interface UserInfo {
  ticket: AuthorizationTicket
  user: User
}
