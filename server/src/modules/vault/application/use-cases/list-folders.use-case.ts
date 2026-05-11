import { Injectable } from '@nestjs/common'
import {
  FolderRepositoryPort,
  type FolderSummary,
} from '../ports/out/folder-repository.port'

@Injectable()
export class ListFoldersUseCase {
  constructor(private readonly folderRepository: FolderRepositoryPort) {}

  async execute(): Promise<FolderSummary[]> {
    return this.folderRepository.findAll()
  }
}
