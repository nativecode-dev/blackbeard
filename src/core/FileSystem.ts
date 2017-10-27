import * as fs from 'fs'

type NodeCallback<T> = (error: NodeJS.ErrnoException, result: T) => void
type NodeFunction<T> = (...args: any[]) => void

function Promisify<T>(nodefn: NodeFunction<T>, ...args: any[]): Promise<T> {
  return new Promise((resolve, reject) => {
    const params = args.concat([(error, result): void => {
      if (error) {
        reject(error)
      }
      resolve(result)
    }])
    nodefn(...params)
  })
}

export class FileSystem {
  public exists(filepath: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      fs.exists(filepath, (exists: boolean) => resolve(exists))
    })
  }

  public dirCreate(path: string): Promise<void> {
    return Promisify<void>(fs.mkdir, path, 0o777)
  }

  public dirDelete(path: string): Promise<void> {
    return Promisify<void>(fs.rmdir, path)
  }

  public dirList(dirpath: string): Promise<string[]> {
    return Promisify<string[]>(fs.readdir, dirpath)
  }

  public fileDelete(path: string): Promise<void> {
    return Promisify<void>(fs.unlink, path)
  }

  public fileRead(filepath: string): Promise<Buffer> {
    return Promisify<Buffer>(fs.readFile, filepath)
  }

  public fileWrite(filepath: string, buffer: Buffer): Promise<void> {
    return Promisify<void>(fs.writeFile, filepath)
  }
}
