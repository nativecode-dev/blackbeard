import { Salutation } from './Salutation'

export interface UserRegistration {
  email: string
  password: string
  name: {
    first: string
    last: string
    salutation: Salutation
  }
}
