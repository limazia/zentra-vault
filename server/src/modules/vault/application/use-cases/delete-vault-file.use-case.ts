import { Injectable } from '@nestjs/common'
import { EventPublisherPort } from '../../../../shared/application/ports/out/event-publisher.port'
import { AuditEvent } from '../../../../shared/domain/events/audit.event'
import { VaultFileNotFoundException } from '../../domain/exceptions/vault-file-not-found.exception'
import { VaultFileRepositoryPort } from '../ports/out/vault-file-repository.port'

type DeleteVaultFileCommand = {
  userId: string
  fileId: string
}

@Injectable()
export class DeleteVaultFileUseCase {
  constructor(
    private readonly fileRepository: VaultFileRepositoryPort,
    private readonly eventPublisher: EventPublisherPort
  ) {}

  async execute(command: DeleteVaultFileCommand): Promise<void> {
    const record = await this.fileRepository.findById(command.fileId)

    if (!record) {
      throw new VaultFileNotFoundException()
    }

    const fileName = record.name
    const folderId = record.folderId

    await this.fileRepository.delete(record.id)

    this.eventPublisher.publish(
      new AuditEvent(
        command.userId,
        'env.delete',
        folderId,
        undefined,
        record.id,
        fileName
      )
    )
  }
}
