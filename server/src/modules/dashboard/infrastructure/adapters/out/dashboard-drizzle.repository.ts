import { Injectable } from '@nestjs/common'
import { count, desc, eq, sql } from 'drizzle-orm'
import { DrizzleService } from '../../../../../shared/infrastructure/persistence/drizzle.service'
import {
  auditLogs,
  folders,
  users,
  vaultFiles,
} from '../../../../../shared/infrastructure/persistence/schema'
import {
  type DashboardData,
  DashboardRepositoryPort,
} from '../../../application/ports/out/dashboard-repository.port'

@Injectable()
export class DashboardDrizzleRepository implements DashboardRepositoryPort {
  constructor(private readonly drizzle: DrizzleService) {}

  async getDashboardData(): Promise<DashboardData> {
    const [stats, recentFolders, recentActivity] = await Promise.all([
      this.getStats(),
      this.getRecentFolders(),
      this.getRecentActivity(),
    ])

    return { stats, recentFolders, recentActivity }
  }

  private async getStats() {
    const [[folderCount], [fileCount], [memberCount], [auditCount]] =
      await Promise.all([
        this.drizzle.db.select({ value: count() }).from(folders),
        this.drizzle.db.select({ value: count() }).from(vaultFiles),
        this.drizzle.db.select({ value: count() }).from(users),
        this.drizzle.db.select({ value: count() }).from(auditLogs),
      ])

    return {
      totalFolders: folderCount?.value ?? 0,
      totalFiles: fileCount?.value ?? 0,
      totalMembers: memberCount?.value ?? 0,
      totalAuditEvents: auditCount?.value ?? 0,
    }
  }

  private async getRecentFolders() {
    const envCountSubquery = sql<number>`(
      SELECT count(*)::int FROM ${vaultFiles}
      WHERE ${vaultFiles.folderId} = ${folders.id}
    )`

    const records = await this.drizzle.db
      .select({
        id: folders.id,
        name: folders.name,
        envCount: envCountSubquery.as('env_count'),
        updatedAt: folders.updatedAt,
      })
      .from(folders)
      .orderBy(desc(folders.updatedAt))
      .limit(4)

    return records.map((r) => ({
      id: r.id,
      name: r.name,
      envCount: r.envCount,
      lastUpdatedAt: r.updatedAt.toISOString(),
    }))
  }

  private async getRecentActivity() {
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
      .orderBy(desc(auditLogs.createdAt))
      .limit(5)

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
