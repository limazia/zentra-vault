import { Module } from '@nestjs/common'
import { AuditModule } from '../modules/audit/infrastructure/audit.module'
import { DashboardModule } from '../modules/dashboard/infrastructure/dashboard.module'
import { UserModule } from '../modules/user/infrastructure/user.module'
import { VaultModule } from '../modules/vault/infrastructure/vault.module'
import { SharedAuthModule } from '../shared/infrastructure/auth/shared-auth.module'
import { EnvModule } from '../shared/infrastructure/env/env.module'
import { SharedEventModule } from '../shared/infrastructure/events/shared-event.module'
import { DrizzleModule } from '../shared/infrastructure/persistence/drizzle.module'

@Module({
  imports: [
    EnvModule,
    DrizzleModule,
    SharedAuthModule,
    SharedEventModule,
    UserModule,
    VaultModule,
    AuditModule,
    DashboardModule,
  ],
})
export class AppModule {}
