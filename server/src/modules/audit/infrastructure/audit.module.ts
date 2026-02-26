import { Module } from '@nestjs/common'
import { AuditLogRepositoryPort } from '../application/ports/out/audit-log-repository.port'
import { ListAuditLogsUseCase } from '../application/use-cases/list-audit-logs.use-case'
import { AuditController } from './adapters/in/audit.controller'
import { AuditEventListener } from './adapters/in/listeners/audit-event.listener'
import { AuditLogDrizzleRepository } from './adapters/out/audit-log-drizzle.repository'

@Module({
  providers: [
    { provide: AuditLogRepositoryPort, useClass: AuditLogDrizzleRepository },
    ListAuditLogsUseCase,
    AuditEventListener,
  ],
  controllers: [AuditController],
})
export class AuditModule {}
