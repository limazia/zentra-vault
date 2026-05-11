import type { AuditLog } from '../../../domain/entities/audit-log'

export type AuditLogSummary = {
  id: string
  userId: string
  userName: string
  userAvatar: string | null
  action: string
  folderName: string
  fileName: string
  timestamp: string
}

type ListAuditLogsParams = {
  search?: string
  actions?: string[]
}

export abstract class AuditLogRepositoryPort {
  abstract save(auditLog: AuditLog): Promise<void>
  abstract findAll(params: ListAuditLogsParams): Promise<AuditLogSummary[]>
}
