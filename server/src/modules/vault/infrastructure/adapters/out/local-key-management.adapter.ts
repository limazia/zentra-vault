import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../../../../../shared/infrastructure/env/env.service'
import { KeyManagementPort } from '../../../application/ports/out/key-management.port'

const AES_ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16
const LOCAL_KEY_ID = 'local-dev-key'

@Injectable()
export class LocalKeyManagementAdapter implements KeyManagementPort {
  private readonly kek: Buffer

  constructor(env: EnvService) {
    const hex = env.get('LOCAL_KEK_HEX')
    if (!hex) {
      throw new Error('LOCAL_KEK_HEX is required when KMS_PROVIDER=local')
    }
    this.kek = Buffer.from(hex, 'hex')
  }

  async wrapKey(key: Buffer): Promise<{ wrappedKey: string; keyId: string }> {
    const iv = randomBytes(IV_LENGTH)
    const cipher = createCipheriv(AES_ALGORITHM, this.kek, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    })

    const encrypted = Buffer.concat([cipher.update(key), cipher.final()])
    const authTag = cipher.getAuthTag()

    const wrapped = Buffer.concat([iv, authTag, encrypted])

    return {
      wrappedKey: wrapped.toString('base64'),
      keyId: LOCAL_KEY_ID,
    }
  }

  async unwrapKey(params: {
    wrappedKey: string
    keyId: string
  }): Promise<Buffer> {
    const wrapped = Buffer.from(params.wrappedKey, 'base64')

    const iv = wrapped.subarray(0, IV_LENGTH)
    const authTag = wrapped.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH)
    const encrypted = wrapped.subarray(IV_LENGTH + AUTH_TAG_LENGTH)

    const decipher = createDecipheriv(AES_ALGORITHM, this.kek, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    })
    decipher.setAuthTag(authTag)

    return Buffer.concat([decipher.update(encrypted), decipher.final()])
  }
}
