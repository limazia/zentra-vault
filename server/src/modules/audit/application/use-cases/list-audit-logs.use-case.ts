import { Injectable } from '@nestjs/common'
import {
  AuditLogRepositoryPort,
  type AuditLogSummary,
} from '../ports/out/audit-log-repository.port'

type ListAuditLogsQuery = {
  search?: string
  actions?: string[]
}

@Injectable()
export class ListAuditLogsUseCase {
  constructor(private readonly auditLogRepository: AuditLogRepositoryPort) {}

  async execute(query: ListAuditLogsQuery): Promise<AuditLogSummary[]> {
    return this.auditLogRepository.findAll({
      search: query.search,
      actions: query.actions,
    })
  }
}
