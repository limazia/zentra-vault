import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { EnvService } from '../env/env.service'
import * as schema from './schema'

export type DrizzleDatabase = NodePgDatabase<typeof schema>

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  readonly db: DrizzleDatabase
  private readonly pool: Pool

  constructor(private readonly env: EnvService) {
    this.pool = new Pool({
      connectionString: this.env.get('DATABASE_URL'),
    })
    this.db = drizzle(this.pool, { schema })
  }

  async onModuleDestroy() {
    await this.pool.end()
  }
}
