import 'reflect-metadata'

import * as fs from 'fs'
import { injectable } from 'inversify'
import { PathTransformer } from './PathTransformer'

type NodeFunction = (...args: any[]) => void

@injectable()
export class FileSystem {
  private readonly paths: PathTransformer

  constructor() {
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

  private promisify<T>(nodefn: NodeFunction, ...args: any[]): Promise<T> {
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
