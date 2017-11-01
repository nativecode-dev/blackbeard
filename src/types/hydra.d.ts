declare module 'hydra' {
  interface UMFMessage {
  }

  interface ServiceInfo {
    serviceName: string
    serviceIP: string
    servicePort: number
  }

  interface ServiceConfig {
    environment: string
    hydra: {
      serviceName: string
      serviceIP: string
      servicePort: number
      serviceType: string
      serviceDescription: string
      redis: {
        url: string
      }
    }
  }

  class Hydra extends NodeJS.EventEmitter { }

  class IHydra extends Hydra {
    createUMFMessage(message: any): UMFMessage
    findService(name: string): Promise<any>
    getAllServiceRoutes(): Promise<any>
    getClonedRedisClient(): any
    getConfig(label: string): Promise<any>
    getConfigHelper(): any
    getHealth(): Promise<any>
    getInstanceID(): string
    getInstanceVersion(): string
    getQueuedMessage(serviceName: string): Promise<void>
    getServerRequestHelper(): any
    getServerResponseHelper(): any
    getServiceHealthAll(): Promise<any[]>
    getServiceHealthLog(name: string): Promise<any[]>
    getServiceName(): string
    getServiceNodes(): Promise<string[]>
    getServicePresence(name: string): Promise<any>
    getServices(): Promise<any[]>
    hasServicePresence(name: string): Promise<boolean>
    getUMFMessageHelper(): any
    getUtilsHelper(): any
    init(config: string | ServiceConfig, testMode?: boolean): Promise<ServiceConfig>
    listConfig(serviceName: string): Promise<string[]>
    makeAPIRequest(message: UMFMessage): Promise<any>
    markQueueMessage(message: UMFMessage, completed: boolean, reason: string): Promise<void>
    matchRoute(route: string): boolean
    putConfig(label: string, config: ServiceConfig): Promise<void>
    queueMessage(message: UMFMessage): Promise<void>
    registerRoutes(routes: any[]): Promise<void>
    registerService(): Promise<ServiceInfo>
    sendBroadcastMessage(message: string | UMFMessage): Promise<void>
    sendMessage(message: string | UMFMessage): Promise<void>
    sendReplyMessage(originalMessage: UMFMessage, messageResponse: UMFMessage): Promise<void>
    sendToHealthLog(type: string, message: string, suppressEmit: boolean): void
    shutdown(): Promise<void>
    use(...plugins: any[]): Promise<void>
  }

  export = new IHydra()
}
