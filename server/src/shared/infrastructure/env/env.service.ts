import { Injectable, Logger } from '@nestjs/common'
import z from 'zod'
import type { Env } from './env'
import { envSchema } from './env'

@Injectable()
export class EnvService {
  private readonly env: Env

  constructor() {
    const result = envSchema.safeParse(process.env)

    if (!result.success) {
      const logger = new Logger(EnvService.name)
      logger.error('Invalid environment variables:')
      logger.error(z.treeifyError(result.error))
      process.exit(1)
    }

    this.env = result.data
  }

  get<K extends keyof Env>(key: K): Env[K] {
    return this.env[key]
  }
}
