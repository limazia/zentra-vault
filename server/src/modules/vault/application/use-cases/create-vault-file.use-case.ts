import { randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { EventPublisherPort } from '../../../../shared/application/ports/out/event-publisher.port'
import { AuditEvent } from '../../../../shared/domain/events/audit.event'
import { VaultFile } from '../../domain/entities/vault-file'
import { EncryptionPort } from '../ports/out/encryption.port'
import { VaultFileRepositoryPort } from '../ports/out/vault-file-repository.port'
import { VaultKeyService } from '../services/vault-key.service'

type CreateVaultFileCommand = {
  folderId: string
  name: string
  content: string
  userId: string
  vaultPassword: string
}

type CreateVaultFileResult = {
  id: string
  folderId: string
  name: string
  size: number
  createdAt: Date
}

@Injectable()
export class CreateVaultFileUseCase {
  constructor(
    private readonly fileRepository: VaultFileRepositoryPort,
    private readonly vaultKeyService: VaultKeyService,
    private readonly encryption: EncryptionPort,
    private readonly eventPublisher: EventPublisherPort
  ) {}

  async execute(
    command: CreateVaultFileCommand
  ): Promise<CreateVaultFileResult> {
    const contentBuffer = Buffer.from(command.content, 'utf8')

    const file = VaultFile.create({
      folderId: command.folderId,
      name: command.name,
      size: contentBuffer.length,
      createdById: command.userId,
    })

    const orgKey = await this.vaultKeyService.getOrgKey({
      userId: command.userId,
      vaultPassword: command.vaultPassword,
    })

    const dek = this.encryption.generateKey()

    const { ciphertext: encryptedContent, iv: contentIv } =
      this.encryption.encrypt({
        plaintext: contentBuffer,
        key: dek,
        aad: `purpose:file_content|file:${file.id}|v:1`,
      })

    const { ciphertext: wrappedDek, iv: dekIv } = this.encryption.encrypt({
      plaintext: dek,
      key: orgKey,
      aad: `purpose:dek_wrap|file:${file.id}|v:1`,
    })

    await this.fileRepository.save({
      id: file.id,
      folderId: file.folderId,
      name: file.name,
      encryptedContent,
      contentIv,
      wrappedDek,
      dekIv,
      size: file.size,
      createdById: file.createdById,
      lastEditedById: file.lastEditedById,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    })

    await this.fileRepository.saveHistory({
      id: randomUUID(),
      fileId: file.id,
      editedById: command.userId,
    })

    this.eventPublisher.publish(
      new AuditEvent(
        command.userId,
        'env.create',
        command.folderId,
        undefined,
        file.id,
        file.name
      )
    )

    return {
      id: file.id,
      folderId: file.folderId,
      name: file.name,
      size: file.size,
      createdAt: file.createdAt,
    }
  }
}
