declare module 'irc-message' {
  export class IRCMessage {
    public command: string
    public params: string[]
    public prefix: string
    public tags: any
    public prefixIsHostmask(): boolean
    public prefixIsServer(): boolean
    public parseHostmaskFromPrefix(): boolean
  }
}
