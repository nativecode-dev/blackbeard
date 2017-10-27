export class Scheduler {
  private readonly configfile: string

  constructor(configfile: string) {
    this.configfile = configfile
  }

  public start(): Promise<void> {
    return Promise.resolve()
  }
}
