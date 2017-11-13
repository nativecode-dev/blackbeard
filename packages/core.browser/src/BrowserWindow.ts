import { Dictionary } from '@beard/core'

export interface BrowserWindow extends Dictionary<any> {
  env?: Dictionary<string>
}
