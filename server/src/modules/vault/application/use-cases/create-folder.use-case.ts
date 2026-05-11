import { Injectable } from '@nestjs/common'
import { EventPublisherPort } from '../../../../shared/application/ports/out/event-publisher.port'
import { AuditEvent } from '../../../../shared/domain/events/audit.event'
import { Folder } from '../../domain/entities/folder'
import { FolderRepositoryPort } from '../ports/out/folder-repository.port'

interface CreateFolderCommand {
  userId: string
  name: string
  description?: string
}

@Injectable()
export class CreateFolderUseCase {
  constructor(
    private readonly folderRepository: FolderRepositoryPort,
    private readonly eventPublisher: EventPublisherPort
  ) {}

  async execute(command: CreateFolderCommand): Promise<Folder> {
    const folder = Folder.create({
      name: command.name,
      description: command.description,
      createdById: command.userId,
    })

    await this.folderRepository.save(folder)

    this.eventPublisher.publish(
      new AuditEvent(command.userId, 'folder.create', folder.id, folder.name)
    )

    return folder
  }
}
