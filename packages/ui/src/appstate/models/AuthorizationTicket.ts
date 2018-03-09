export interface AuthorizationTicket {
  error?: string
  expiration: Date
  token: string
}
