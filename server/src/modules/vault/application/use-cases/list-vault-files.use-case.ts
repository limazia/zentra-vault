import { Injectable } from '@nestjs/common'
import {
  type FileSummary,
  VaultFileRepositoryPort,
} from '../ports/out/vault-file-repository.port'

type ListVaultFilesQuery = {
  folderId: string
}

@Injectable()
export class ListVaultFilesUseCase {
  constructor(private readonly fileRepository: VaultFileRepositoryPort) {}

  async execute(query: ListVaultFilesQuery): Promise<FileSummary[]> {
    return this.fileRepository.findByFolderId(query.folderId)
  }
}
