import { HydraConfigRedis } from './HydraConfigRedis'

export interface HydraConfig {
  serviceName: string
  serviceIP: string
  servicePort: number
  serviceType: string
  serviceDescription: string
  redis: HydraConfigRedis
}
