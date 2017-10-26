export abstract class Client {
  protected onoff(value: boolean): string {
    return value ? 'on' : 'off'
  }
}
