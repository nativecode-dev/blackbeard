import 'reflect-metadata'

import * as fs from 'fs'
import { inject, injectable } from 'inversify'
import { Logger, LoggerType } from '@beard/core'
import { PathTransformer } from './PathTransformer'

type NodeCallback<T> = (error: NodeJS.ErrnoException, result: T) => void
type NodeFunction<T> = (...args: any[]) => void

@injectable()
export class FileSystem {
  private readonly log: Logger
  private readonly paths: PathTransformer

  constructor( @inject(LoggerType) logger: Logger) {
    this.log = logger.extend('filesystem')
    this.paths = new PathTransformer()
  }

  public exists(filepath: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      fs.exists(filepath, (exists: boolean) => resolve(exists))
    })
  }

  public dirCreate(path: string): Promise<void> {
    return this.promisify<void>(fs.mkdir, path, 0o777)
  }

  public dirDelete(path: string): Promise<void> {
    return this.promisify<void>(fs.rmdir, path)
  }

  public dirList(dirpath: string): Promise<string[]> {
    return this.promisify<string[]>(fs.readdir, dirpath)
  }

  public fileDelete(path: string): Promise<void> {
    return this.promisify<void>(fs.unlink, path)
  }

  public fileRead(filepath: string): Promise<Buffer> {
    return this.promisify<Buffer>(fs.readFile, filepath)
  }

  public fileWrite(filepath: string, buffer: Buffer): Promise<void> {
    return this.promisify<void>(fs.writeFile, filepath)
  }

  public async json<T>(filepath: string): Promise<T> {
    const buffer = await this.fileRead(filepath)
    const text = buffer.toString('utf8')
    const json = JSON.parse(text)
    return this.paths.transformObject(json)
  }

  public save<T>(filepath: string, data: T): Promise<void> {
    const buffer = new Buffer(JSON.stringify(data))
    return this.fileWrite(filepath, buffer)
  }

  private promisify<T>(nodefn: NodeFunction<T>, ...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      const params = args.concat([(error: NodeJS.ErrnoException, result: T): void => {
        if (error) {
          reject(error)
        }
        resolve(result)
      }])
      nodefn(...params)
    })
  }
}
