type OrgKeyRecord = {
  wrappedKey: string
  keyId: string
}

type SaveOrgKeyParams = {
  id: string
  wrappedKey: string
  keyId: string
}

type UserVaultKeyRecord = {
  encryptedOrgKey: string
  salt: string
  iv: string
}

type SaveUserVaultKeyParams = {
  id: string
  userId: string
  encryptedOrgKey: string
  salt: string
  iv: string
}

export abstract class VaultKeyRepositoryPort {
  abstract findOrgKey(): Promise<OrgKeyRecord | null>
  abstract saveOrgKey(params: SaveOrgKeyParams): Promise<void>
  abstract findUserVaultKey(userId: string): Promise<UserVaultKeyRecord | null>
  abstract saveUserVaultKey(params: SaveUserVaultKeyParams): Promise<void>
  abstract findUserPasswordHash(userId: string): Promise<string | null>
}
