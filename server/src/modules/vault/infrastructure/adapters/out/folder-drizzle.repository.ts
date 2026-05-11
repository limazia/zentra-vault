import { Injectable } from '@nestjs/common'
import { desc, eq, sql } from 'drizzle-orm'
import { DrizzleService } from '../../../../../shared/infrastructure/persistence/drizzle.service'
import {
  folders,
  users,
  vaultFiles,
} from '../../../../../shared/infrastructure/persistence/schema'
import {
  FolderRepositoryPort,
  type FolderSummary,
} from '../../../application/ports/out/folder-repository.port'
import { Folder } from '../../../domain/entities/folder'

@Injectable()
export class FolderDrizzleRepository implements FolderRepositoryPort {
  constructor(private readonly drizzle: DrizzleService) {}

  async save(folder: Folder): Promise<void> {
    await this.drizzle.db
      .insert(folders)
      .values({
        id: folder.id,
        name: folder.name,
        description: folder.description,
        createdById: folder.createdById,
      })
      .onConflictDoUpdate({
        target: folders.id,
        set: {
          name: folder.name,
          description: folder.description,
          updatedAt: new Date(),
        },
      })
  }

  async findById(id: string): Promise<Folder | null> {
    const [record] = await this.drizzle.db
      .select()
      .from(folders)
      .where(eq(folders.id, id))
      .limit(1)

    if (!record) return null

    return Folder.reconstitute({
      id: record.id,
      name: record.name,
      description: record.description,
      createdById: record.createdById,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    })
  }

  async findSummaryById(id: string): Promise<FolderSummary | null> {
    const envCountSubquery = sql<number>`(
      SELECT count(*)::int FROM ${vaultFiles}
      WHERE ${vaultFiles.folderId} = ${folders.id}
    )`

    const [record] = await this.drizzle.db
      .select({
        id: folders.id,
        name: folders.name,
        description: folders.description,
        envCount: envCountSubquery.as('env_count'),
        createdByName: users.name,
        createdAt: folders.createdAt,
        updatedAt: folders.updatedAt,
      })
      .from(folders)
      .innerJoin(users, eq(folders.createdById, users.id))
      .where(eq(folders.id, id))
      .limit(1)

    if (!record) return null

    return {
      id: record.id,
      name: record.name,
      description: record.description,
      envCount: record.envCount,
      createdByName: record.createdByName,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }
  }

  async findAll(): Promise<FolderSummary[]> {
    const envCountSubquery = sql<number>`(
      SELECT count(*)::int FROM ${vaultFiles}
      WHERE ${vaultFiles.folderId} = ${folders.id}
    )`

    const records = await this.drizzle.db
      .select({
        id: folders.id,
        name: folders.name,
        description: folders.description,
        envCount: envCountSubquery.as('env_count'),
        createdByName: users.name,
        createdAt: folders.createdAt,
        updatedAt: folders.updatedAt,
      })
      .from(folders)
      .innerJoin(users, eq(folders.createdById, users.id))
      .orderBy(desc(folders.updatedAt))

    return records.map((record) => ({
      id: record.id,
      name: record.name,
      description: record.description,
      envCount: record.envCount,
      createdByName: record.createdByName,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }))
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(folders).where(eq(folders.id, id))
  }
}
