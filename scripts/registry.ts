export interface Dictionary {
  [key: string]: string
}

export interface NPM {
  author: string | string[] | Dictionary
  dependencies: Dictionary
  devDependencies: Dictionary
  scripts: Dictionary
}

export interface Updater {
  name: string
  exec(workspace: Workspace): Promise<void>
}

export type Updaters = {
  [key: string]: Updater
}

export interface Workspace {
  basepath: string
  configs: Dictionary
  name: string
  npm: string
}

const registrations: Updaters = {}

export function GetRegistered(name: string): Updater {
  return registrations[name]
}

export function Register(name: string, updater: Updater): void {
  registrations[name] = updater
}

export function Registered(): string[] {
  return Object.keys(registrations)
}
