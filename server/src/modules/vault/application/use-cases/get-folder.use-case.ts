import { Injectable } from '@nestjs/common'
import { FolderNotFoundException } from '../../domain/exceptions/folder-not-found.exception'
import {
  FolderRepositoryPort,
  type FolderSummary,
} from '../ports/out/folder-repository.port'

type GetFolderQuery = {
  folderId: string
}

@Injectable()
export class GetFolderUseCase {
  constructor(private readonly folderRepository: FolderRepositoryPort) {}

  async execute(query: GetFolderQuery): Promise<FolderSummary> {
    const folder = await this.folderRepository.findSummaryById(query.folderId)

    if (!folder) {
      throw new FolderNotFoundException()
    }

    return folder
  }
}
