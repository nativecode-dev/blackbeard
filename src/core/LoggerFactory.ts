import 'reflect-metadata'

import { injectable } from 'inversify'
import { DefaultLogger, Logger } from './Logger'

@injectable()
export class LoggerFactory {
  public create(name: string): Logger {
    return DefaultLogger.extend(name)
  }
}
