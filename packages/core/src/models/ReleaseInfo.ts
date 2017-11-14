import { Protocol } from './enums'

export interface ReleaseInfo {
  downloadUrl: string
  title: string
  protocol: Protocol
  publishDate: string
}
