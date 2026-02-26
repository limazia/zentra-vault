import { Injectable } from '@nestjs/common'
import { and, desc, eq, ilike, inArray, or, type SQL } from 'drizzle-orm'
import { DrizzleService } from '../../../../../shared/infrastructure/persistence/drizzle.service'
import {
  auditLogs,
  users,
} from '../../../../../shared/infrastructure/persistence/schema'
import {
  AuditLogRepositoryPort,
  type AuditLogSummary,
} from '../../../application/ports/out/audit-log-repository.port'
import type { AuditLog } from '../../../domain/entities/audit-log'

@Injectable()
export class AuditLogDrizzleRepository implements AuditLogRepositoryPort {
  constructor(private readonly drizzle: DrizzleService) {}

  async save(auditLog: AuditLog): Promise<void> {
    await this.drizzle.db.insert(auditLogs).values({
      id: auditLog.id,
      userId: auditLog.userId,
      action: auditLog.action,
      folderId: auditLog.folderId,
      folderName: auditLog.folderName,
      fileId: auditLog.fileId,
      fileName: auditLog.fileName,
      createdAt: auditLog.createdAt,
    })
  }

  async findAll(params: {
    search?: string
    actions?: string[]
  }): Promise<AuditLogSummary[]> {
    const conditions: SQL[] = []

    if (params.actions && params.actions.length > 0) {
      conditions.push(inArray(auditLogs.action, params.actions))
    }

    if (params.search) {
      const pattern = `%${params.search}%`
      const searchCondition = or(
        ilike(users.name, pattern),
        ilike(auditLogs.folderName, pattern),
        ilike(auditLogs.fileName, pattern),
        ilike(auditLogs.action, pattern)
      )
      if (searchCondition) {
        conditions.push(searchCondition)
      }
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined

    const records = await this.drizzle.db
      .select({
        id: auditLogs.id,
        userId: auditLogs.userId,
        userName: users.name,
        userAvatar: users.avatarUrl,
        action: auditLogs.action,
        folderName: auditLogs.folderName,
        fileName: auditLogs.fileName,
        createdAt: auditLogs.createdAt,
      })
      .from(auditLogs)
      .innerJoin(users, eq(auditLogs.userId, users.id))
      .where(where)
      .orderBy(desc(auditLogs.createdAt))

    return records.map((r) => ({
      id: r.id,
      userId: r.userId,
      userName: r.userName,
      userAvatar: r.userAvatar,
      action: r.action,
      folderName: r.folderName,
      fileName: r.fileName,
      timestamp: r.createdAt.toISOString(),
    }))
  }
}
