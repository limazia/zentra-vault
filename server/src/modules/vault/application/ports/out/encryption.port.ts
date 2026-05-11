type EncryptParams = {
  plaintext: Buffer
  key: Buffer
  aad?: string
}

type EncryptResult = {
  ciphertext: string
  iv: string
}

type DecryptParams = {
  ciphertext: string
  iv: string
  key: Buffer
  aad?: string
}

type DeriveKeyParams = {
  password: string
  salt: Buffer
}

export abstract class EncryptionPort {
  abstract encrypt(params: EncryptParams): EncryptResult
  abstract decrypt(params: DecryptParams): Buffer
  abstract generateKey(): Buffer
  abstract deriveKey(params: DeriveKeyParams): Promise<Buffer>
  abstract generateSalt(): Buffer
}
