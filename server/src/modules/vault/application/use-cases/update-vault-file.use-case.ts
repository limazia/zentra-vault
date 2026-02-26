import { randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { EventPublisherPort } from '../../../../shared/application/ports/out/event-publisher.port'
import { AuditEvent } from '../../../../shared/domain/events/audit.event'
import { VaultFileNotFoundException } from '../../domain/exceptions/vault-file-not-found.exception'
import { EncryptionPort } from '../ports/out/encryption.port'
import { VaultFileRepositoryPort } from '../ports/out/vault-file-repository.port'
import { VaultKeyService } from '../services/vault-key.service'

type UpdateVaultFileCommand = {
  fileId: string
  content: string
  userId: string
  vaultPassword: string
}

@Injectable()
export class UpdateVaultFileUseCase {
  constructor(
    private readonly fileRepository: VaultFileRepositoryPort,
    private readonly vaultKeyService: VaultKeyService,
    private readonly encryption: EncryptionPort,
    private readonly eventPublisher: EventPublisherPort
  ) {}

  async execute(command: UpdateVaultFileCommand): Promise<void> {
    const record = await this.fileRepository.findById(command.fileId)

    if (!record) {
      throw new VaultFileNotFoundException()
    }

    const contentBuffer = Buffer.from(command.content, 'utf8')

    const orgKey = await this.vaultKeyService.getOrgKey({
      userId: command.userId,
      vaultPassword: command.vaultPassword,
    })

    const dek = this.encryption.generateKey()

    const { ciphertext: encryptedContent, iv: contentIv } =
      this.encryption.encrypt({
        plaintext: contentBuffer,
        key: dek,
        aad: `purpose:file_content|file:${record.id}|v:1`,
      })

    const { ciphertext: wrappedDek, iv: dekIv } = this.encryption.encrypt({
      plaintext: dek,
      key: orgKey,
      aad: `purpose:dek_wrap|file:${record.id}|v:1`,
    })

    await this.fileRepository.update({
      ...record,
      encryptedContent,
      contentIv,
      wrappedDek,
      dekIv,
      size: contentBuffer.length,
      lastEditedById: command.userId,
      updatedAt: new Date(),
    })

    await this.fileRepository.saveHistory({
      id: randomUUID(),
      fileId: record.id,
      editedById: command.userId,
    })

    this.eventPublisher.publish(
      new AuditEvent(
        command.userId,
        'env.update',
        record.folderId,
        undefined,
        record.id,
        record.name
      )
    )
  }
}
