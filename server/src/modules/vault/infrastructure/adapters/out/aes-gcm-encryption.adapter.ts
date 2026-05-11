import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import * as argon2 from 'argon2'
import { EncryptionPort } from '../../../application/ports/out/encryption.port'

const AES_ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const SALT_LENGTH = 16
const KEY_LENGTH = 32
const AUTH_TAG_LENGTH = 16

@Injectable()
export class AesGcmEncryptionAdapter implements EncryptionPort {
  encrypt(params: { plaintext: Buffer; key: Buffer; aad?: string }): {
    ciphertext: string
    iv: string
  } {
    const iv = randomBytes(IV_LENGTH)
    const cipher = createCipheriv(AES_ALGORITHM, params.key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    })

    if (params.aad) {
      cipher.setAAD(Buffer.from(params.aad, 'utf8'))
    }

    const encrypted = Buffer.concat([
      cipher.update(params.plaintext),
      cipher.final(),
    ])
    const authTag = cipher.getAuthTag()

    const ciphertextWithTag = Buffer.concat([encrypted, authTag])

    return {
      ciphertext: ciphertextWithTag.toString('base64'),
      iv: iv.toString('base64'),
    }
  }

  decrypt(params: {
    ciphertext: string
    iv: string
    key: Buffer
    aad?: string
  }): Buffer {
    const ciphertextWithTag = Buffer.from(params.ciphertext, 'base64')
    const iv = Buffer.from(params.iv, 'base64')

    const authTag = ciphertextWithTag.subarray(
      ciphertextWithTag.length - AUTH_TAG_LENGTH
    )
    const encrypted = ciphertextWithTag.subarray(
      0,
      ciphertextWithTag.length - AUTH_TAG_LENGTH
    )

    const decipher = createDecipheriv(AES_ALGORITHM, params.key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    })

    decipher.setAuthTag(authTag)

    if (params.aad) {
      decipher.setAAD(Buffer.from(params.aad, 'utf8'))
    }

    return Buffer.concat([decipher.update(encrypted), decipher.final()])
  }

  generateKey(): Buffer {
    return randomBytes(KEY_LENGTH)
  }

  async deriveKey(params: { password: string; salt: Buffer }): Promise<Buffer> {
    const hash = await argon2.hash(params.password, {
      type: argon2.argon2id,
      salt: params.salt,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
      hashLength: KEY_LENGTH,
      raw: true,
    })

    return hash
  }

  generateSalt(): Buffer {
    return randomBytes(SALT_LENGTH)
  }
}
