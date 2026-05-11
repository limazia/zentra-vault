import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { eq } from 'drizzle-orm'
import { AuditEvent } from '../../../../../../shared/domain/events/audit.event'
import { DrizzleService } from '../../../../../../shared/infrastructure/persistence/drizzle.service'
import { folders } from '../../../../../../shared/infrastructure/persistence/schema'
import { AuditLogRepositoryPort } from '../../../../application/ports/out/audit-log-repository.port'
import { AuditLog } from '../../../../domain/entities/audit-log'

@Injectable()
export class AuditEventListener {
  constructor(
    private readonly auditLogRepository: AuditLogRepositoryPort,
    private readonly drizzle: DrizzleService
  ) {}

  @OnEvent('AuditEvent', { async: true })
  async handle(event: AuditEvent): Promise<void> {
    const auditLog = AuditLog.create({
      userId: event.userId,
      action: event.action,
      folderId: event.folderId,
      folderName: event.folderName,
      fileId: event.fileId,
      fileName: event.fileName,
    })

    if (!event.folderName && event.folderId) {
      const folderName = await this.resolveFolderName(event.folderId)
      auditLog.setFolderName(folderName)
    }

    await this.auditLogRepository.save(auditLog)
  }

  private async resolveFolderName(folderId: string): Promise<string> {
    const [folder] = await this.drizzle.db
      .select({ name: folders.name })
      .from(folders)
      .where(eq(folders.id, folderId))
      .limit(1)

    return folder?.name ?? '—'
  }
}
