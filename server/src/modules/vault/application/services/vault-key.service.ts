import { randomUUID } from 'node:crypto'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { HashPort } from '../../../user/application/ports/out/hash.port'
import { EncryptionPort } from '../ports/out/encryption.port'
import { KeyManagementPort } from '../ports/out/key-management.port'
import { VaultKeyRepositoryPort } from '../ports/out/vault-key-repository.port'

type GetOrgKeyParams = {
  userId: string
  vaultPassword: string
}

@Injectable()
export class VaultKeyService {
  constructor(
    private readonly vaultKeyRepository: VaultKeyRepositoryPort,
    private readonly encryption: EncryptionPort,
    private readonly kms: KeyManagementPort,
    private readonly hash: HashPort
  ) {}

  async getOrgKey(params: GetOrgKeyParams): Promise<Buffer> {
    const userVaultKey = await this.vaultKeyRepository.findUserVaultKey(
      params.userId
    )

    if (userVaultKey) {
      return this.decryptOrgKey({
        userId: params.userId,
        vaultPassword: params.vaultPassword,
        encryptedOrgKey: userVaultKey.encryptedOrgKey,
        salt: userVaultKey.salt,
        iv: userVaultKey.iv,
      })
    }

    return this.onboardUser({
      userId: params.userId,
      vaultPassword: params.vaultPassword,
    })
  }

  private async decryptOrgKey(params: {
    userId: string
    vaultPassword: string
    encryptedOrgKey: string
    salt: string
    iv: string
  }): Promise<Buffer> {
    const salt = Buffer.from(params.salt, 'base64')

    const userKey = await this.encryption.deriveKey({
      password: params.vaultPassword,
      salt,
    })

    try {
      return this.encryption.decrypt({
        ciphertext: params.encryptedOrgKey,
        iv: params.iv,
        key: userKey,
        aad: this.buildAad(params.userId),
      })
    } catch {
      throw new UnauthorizedException('Invalid vault password')
    }
  }

  private async onboardUser(params: {
    userId: string
    vaultPassword: string
  }): Promise<Buffer> {
    const passwordHash = await this.vaultKeyRepository.findUserPasswordHash(
      params.userId
    )

    if (!passwordHash) {
      throw new UnauthorizedException('Vault password not configured')
    }

    const isValid = await this.hash.compare(params.vaultPassword, passwordHash)
    if (!isValid) {
      throw new UnauthorizedException('Invalid vault password')
    }

    const orgKey = await this.resolveOrgKey()

    const salt = this.encryption.generateSalt()
    const userKey = await this.encryption.deriveKey({
      password: params.vaultPassword,
      salt,
    })

    const { ciphertext, iv } = this.encryption.encrypt({
      plaintext: orgKey,
      key: userKey,
      aad: this.buildAad(params.userId),
    })

    await this.vaultKeyRepository.saveUserVaultKey({
      id: randomUUID(),
      userId: params.userId,
      encryptedOrgKey: ciphertext,
      salt: salt.toString('base64'),
      iv,
    })

    return orgKey
  }

  private async resolveOrgKey(): Promise<Buffer> {
    const existingOrgKey = await this.vaultKeyRepository.findOrgKey()

    if (existingOrgKey) {
      return this.kms.unwrapKey({
        wrappedKey: existingOrgKey.wrappedKey,
        keyId: existingOrgKey.keyId,
      })
    }

    return this.bootstrapOrgKey()
  }

  private async bootstrapOrgKey(): Promise<Buffer> {
    const orgKey = this.encryption.generateKey()

    const { wrappedKey, keyId } = await this.kms.wrapKey(orgKey)

    await this.vaultKeyRepository.saveOrgKey({
      id: randomUUID(),
      wrappedKey,
      keyId,
    })

    return orgKey
  }

  private buildAad(userId: string): string {
    return `purpose:org_key_wrap|user:${userId}|v:1`
  }
}
