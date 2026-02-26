import { Injectable } from '@nestjs/common'
import { count, desc, eq } from 'drizzle-orm'
import { DrizzleService } from '../../../../../shared/infrastructure/persistence/drizzle.service'
import {
  users,
  vaultFileHistory,
  vaultFiles,
} from '../../../../../shared/infrastructure/persistence/schema'
import {
  type EncryptedFileRecord,
  type FileHistoryEntry,
  type FileSummary,
  VaultFileRepositoryPort,
} from '../../../application/ports/out/vault-file-repository.port'

@Injectable()
export class VaultFileDrizzleRepository implements VaultFileRepositoryPort {
  constructor(private readonly drizzle: DrizzleService) {}

  async save(params: EncryptedFileRecord): Promise<void> {
    await this.drizzle.db.insert(vaultFiles).values({
      id: params.id,
      folderId: params.folderId,
      name: params.name,
      encryptedContent: params.encryptedContent,
      contentIv: params.contentIv,
      wrappedDek: params.wrappedDek,
      dekIv: params.dekIv,
      size: params.size,
      createdById: params.createdById,
      lastEditedById: params.lastEditedById,
    })
  }

  async update(params: EncryptedFileRecord): Promise<void> {
    await this.drizzle.db
      .update(vaultFiles)
      .set({
        encryptedContent: params.encryptedContent,
        contentIv: params.contentIv,
        wrappedDek: params.wrappedDek,
        dekIv: params.dekIv,
        size: params.size,
        lastEditedById: params.lastEditedById,
        updatedAt: new Date(),
      })
      .where(eq(vaultFiles.id, params.id))
  }

  async findById(id: string): Promise<EncryptedFileRecord | null> {
    const [record] = await this.drizzle.db
      .select()
      .from(vaultFiles)
      .where(eq(vaultFiles.id, id))
      .limit(1)

    if (!record) return null

    return {
      id: record.id,
      folderId: record.folderId,
      name: record.name,
      encryptedContent: record.encryptedContent,
      contentIv: record.contentIv,
      wrappedDek: record.wrappedDek,
      dekIv: record.dekIv,
      size: record.size,
      createdById: record.createdById,
      lastEditedById: record.lastEditedById,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }
  }

  async findByFolderId(folderId: string): Promise<FileSummary[]> {
    const records = await this.drizzle.db
      .select({
        id: vaultFiles.id,
        name: vaultFiles.name,
        size: vaultFiles.size,
        lastEditedByName: users.name,
        lastEditedByAvatar: users.avatarUrl,
        updatedAt: vaultFiles.updatedAt,
        createdAt: vaultFiles.createdAt,
      })
      .from(vaultFiles)
      .innerJoin(users, eq(vaultFiles.lastEditedById, users.id))
      .where(eq(vaultFiles.folderId, folderId))
      .orderBy(desc(vaultFiles.updatedAt))

    return records.map((r) => ({
      id: r.id,
      name: r.name,
      size: r.size,
      lastEditedByName: r.lastEditedByName,
      lastEditedByAvatar: r.lastEditedByAvatar,
      updatedAt: r.updatedAt,
      createdAt: r.createdAt,
    }))
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(vaultFiles).where(eq(vaultFiles.id, id))
  }

  async countByFolderId(folderId: string): Promise<number> {
    const [result] = await this.drizzle.db
      .select({ value: count() })
      .from(vaultFiles)
      .where(eq(vaultFiles.folderId, folderId))

    return result?.value ?? 0
  }

  async findHistory(fileId: string): Promise<FileHistoryEntry[]> {
    const records = await this.drizzle.db
      .select({
        id: vaultFileHistory.id,
        editedByName: users.name,
        editedByAvatar: users.avatarUrl,
        createdAt: vaultFileHistory.createdAt,
      })
      .from(vaultFileHistory)
      .innerJoin(users, eq(vaultFileHistory.editedById, users.id))
      .where(eq(vaultFileHistory.fileId, fileId))
      .orderBy(desc(vaultFileHistory.createdAt))

    return records.map((r) => ({
      id: r.id,
      editedByName: r.editedByName,
      editedByAvatar: r.editedByAvatar,
      createdAt: r.createdAt,
    }))
  }

  async saveHistory(params: {
    id: string
    fileId: string
    editedById: string
  }): Promise<void> {
    await this.drizzle.db.insert(vaultFileHistory).values({
      id: params.id,
      fileId: params.fileId,
      editedById: params.editedById,
    })
  }
}
