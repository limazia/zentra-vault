import { Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { DrizzleService } from '../../../../../shared/infrastructure/persistence/drizzle.service'
import {
  organizationKeys,
  users,
  userVaultKeys,
} from '../../../../../shared/infrastructure/persistence/schema'
import { VaultKeyRepositoryPort } from '../../../application/ports/out/vault-key-repository.port'

@Injectable()
export class VaultKeyDrizzleRepository extends VaultKeyRepositoryPort {
  constructor(private readonly drizzle: DrizzleService) {
    super()
  }

  async findOrgKey(): Promise<{
    wrappedKey: string
    keyId: string
  } | null> {
    const [record] = await this.drizzle.db
      .select({
        wrappedKey: organizationKeys.wrappedKey,
        keyId: organizationKeys.keyId,
      })
      .from(organizationKeys)
      .limit(1)

    return record ?? null
  }

  async saveOrgKey(params: {
    id: string
    wrappedKey: string
    keyId: string
  }): Promise<void> {
    await this.drizzle.db.insert(organizationKeys).values({
      id: params.id,
      wrappedKey: params.wrappedKey,
      keyId: params.keyId,
    })
  }

  async findUserVaultKey(userId: string): Promise<{
    encryptedOrgKey: string
    salt: string
    iv: string
  } | null> {
    const [record] = await this.drizzle.db
      .select({
        encryptedOrgKey: userVaultKeys.encryptedOrgKey,
        salt: userVaultKeys.salt,
        iv: userVaultKeys.iv,
      })
      .from(userVaultKeys)
      .where(eq(userVaultKeys.userId, userId))
      .limit(1)

    return record ?? null
  }

  async saveUserVaultKey(params: {
    id: string
    userId: string
    encryptedOrgKey: string
    salt: string
    iv: string
  }): Promise<void> {
    await this.drizzle.db.insert(userVaultKeys).values({
      id: params.id,
      userId: params.userId,
      encryptedOrgKey: params.encryptedOrgKey,
      salt: params.salt,
      iv: params.iv,
    })
  }

  async findUserPasswordHash(userId: string): Promise<string | null> {
    const [record] = await this.drizzle.db
      .select({ vaultPasswordHash: users.vaultPasswordHash })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!record) return null

    return record.vaultPasswordHash
  }
}
