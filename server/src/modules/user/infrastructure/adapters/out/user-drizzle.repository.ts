import { Injectable } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import { DrizzleService } from '../../../../../shared/infrastructure/persistence/drizzle.service'
import {
  authProviders,
  users,
} from '../../../../../shared/infrastructure/persistence/schema'
import { UserRepositoryPort } from '../../../application/ports/out/user-repository.port'
import { User } from '../../../domain/entities/user'

@Injectable()
export class UserDrizzleRepository implements UserRepositoryPort {
  constructor(private readonly drizzle: DrizzleService) {}

  async save(user: User): Promise<void> {
    await this.drizzle.db
      .insert(users)
      .values({
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        vaultPasswordHash: user.vaultPasswordHash,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          vaultPasswordHash: user.vaultPasswordHash,
          updatedAt: new Date(),
        },
      })
  }

  async findById(id: string): Promise<User | null> {
    const [record] = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (!record) return null

    return User.reconstitute({
      id: record.id,
      name: record.name,
      email: record.email,
      avatarUrl: record.avatarUrl,
      vaultPasswordHash: record.vaultPasswordHash,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    })
  }

  async findByAuthProvider(params: {
    provider: string
    providerUserId: string
  }): Promise<User | null> {
    const [record] = await this.drizzle.db
      .select({ user: users })
      .from(authProviders)
      .innerJoin(users, eq(authProviders.userId, users.id))
      .where(
        and(
          eq(authProviders.provider, params.provider),
          eq(authProviders.providerUserId, params.providerUserId)
        )
      )
      .limit(1)

    if (!record) return null

    return User.reconstitute({
      id: record.user.id,
      name: record.user.name,
      email: record.user.email,
      avatarUrl: record.user.avatarUrl,
      vaultPasswordHash: record.user.vaultPasswordHash,
      createdAt: record.user.createdAt,
      updatedAt: record.user.updatedAt,
    })
  }

  async linkAuthProvider(params: {
    userId: string
    provider: string
    providerUserId: string
    providerUsername?: string
    providerAvatarUrl?: string
  }): Promise<void> {
    await this.drizzle.db.insert(authProviders).values({
      id: crypto.randomUUID(),
      userId: params.userId,
      provider: params.provider,
      providerUserId: params.providerUserId,
      providerUsername: params.providerUsername,
      providerAvatarUrl: params.providerAvatarUrl,
    })
  }
}
