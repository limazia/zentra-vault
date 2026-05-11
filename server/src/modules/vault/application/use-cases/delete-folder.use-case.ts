import { Injectable } from '@nestjs/common'
import { EventPublisherPort } from '../../../../shared/application/ports/out/event-publisher.port'
import { AuditEvent } from '../../../../shared/domain/events/audit.event'
import { FolderNotFoundException } from '../../domain/exceptions/folder-not-found.exception'
import { FolderRepositoryPort } from '../ports/out/folder-repository.port'

interface DeleteFolderCommand {
  userId: string
  folderId: string
}

@Injectable()
export class DeleteFolderUseCase {
  constructor(
    private readonly folderRepository: FolderRepositoryPort,
    private readonly eventPublisher: EventPublisherPort
  ) {}

  async execute(command: DeleteFolderCommand): Promise<void> {
    const folder = await this.folderRepository.findById(command.folderId)

    if (!folder) {
      throw new FolderNotFoundException()
    }

    const folderName = folder.name

    await this.folderRepository.delete(folder.id)

    this.eventPublisher.publish(
      new AuditEvent(command.userId, 'folder.delete', folder.id, folderName)
    )
  }
}
