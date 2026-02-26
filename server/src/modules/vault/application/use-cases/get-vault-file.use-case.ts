import { Injectable } from '@nestjs/common'
import { EventPublisherPort } from '../../../../shared/application/ports/out/event-publisher.port'
import { AuditEvent } from '../../../../shared/domain/events/audit.event'
import { VaultFileNotFoundException } from '../../domain/exceptions/vault-file-not-found.exception'
import { EncryptionPort } from '../ports/out/encryption.port'
import { VaultFileRepositoryPort } from '../ports/out/vault-file-repository.port'
import { VaultKeyService } from '../services/vault-key.service'

type GetVaultFileQuery = {
  fileId: string
  userId: string
  vaultPassword: string
}

type GetVaultFileResult = {
  id: string
  folderId: string
  name: string
  content: string
  size: number
  lastEditedById: string
  createdAt: Date
  updatedAt: Date
}

@Injectable()
export class GetVaultFileUseCase {
  constructor(
    private readonly fileRepository: VaultFileRepositoryPort,
    private readonly vaultKeyService: VaultKeyService,
    private readonly encryption: EncryptionPort,
    private readonly eventPublisher: EventPublisherPort
  ) {}

  async execute(query: GetVaultFileQuery): Promise<GetVaultFileResult> {
    const record = await this.fileRepository.findById(query.fileId)

    if (!record) {
      throw new VaultFileNotFoundException()
    }

    const orgKey = await this.vaultKeyService.getOrgKey({
      userId: query.userId,
      vaultPassword: query.vaultPassword,
    })

    const dek = this.encryption.decrypt({
      ciphertext: record.wrappedDek,
      iv: record.dekIv,
      key: orgKey,
      aad: `purpose:dek_wrap|file:${record.id}|v:1`,
    })

    const contentBuffer = this.encryption.decrypt({
      ciphertext: record.encryptedContent,
      iv: record.contentIv,
      key: dek,
      aad: `purpose:file_content|file:${record.id}|v:1`,
    })

    this.eventPublisher.publish(
      new AuditEvent(
        query.userId,
        'env.view',
        record.folderId,
        undefined,
        record.id,
        record.name
      )
    )

    return {
      id: record.id,
      folderId: record.folderId,
      name: record.name,
      content: contentBuffer.toString('utf8'),
      size: record.size,
      lastEditedById: record.lastEditedById,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }
  }
}
