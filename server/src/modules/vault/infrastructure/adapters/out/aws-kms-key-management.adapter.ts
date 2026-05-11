/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import { DecryptCommand, EncryptCommand, KMSClient } from '@aws-sdk/client-kms'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../../../../../shared/infrastructure/env/env.service'
import { KeyManagementPort } from '../../../application/ports/out/key-management.port'

@Injectable()
export class AwsKmsKeyManagementAdapter implements KeyManagementPort {
  private readonly client: KMSClient
  private readonly keyArn: string

  constructor(env: EnvService) {
    this.keyArn = env.get('AWS_KMS_KEY_ARN')!
    this.client = new KMSClient({ region: env.get('AWS_REGION')! })
  }

  async wrapKey(key: Buffer): Promise<{ wrappedKey: string; keyId: string }> {
    const command = new EncryptCommand({
      KeyId: this.keyArn,
      Plaintext: key,
    })

    const response = await this.client.send(command)

    return {
      wrappedKey: Buffer.from(response.CiphertextBlob!).toString('base64'),
      keyId: response.KeyId!,
    }
  }

  async unwrapKey(params: {
    wrappedKey: string
    keyId: string
  }): Promise<Buffer> {
    const command = new DecryptCommand({
      KeyId: params.keyId,
      CiphertextBlob: Buffer.from(params.wrappedKey, 'base64'),
    })

    const response = await this.client.send(command)

    return Buffer.from(response.Plaintext!)
  }
}
