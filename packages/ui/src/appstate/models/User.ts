export interface User {
  email: string
  name: string
  stats: {
    lastLogin?: Date
  }
}
