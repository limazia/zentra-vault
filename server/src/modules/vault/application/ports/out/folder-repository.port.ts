import type { Folder } from '../../../domain/entities/folder'

export interface FolderSummary {
  id: string
  name: string
  description: string
  envCount: number
  createdByName: string
  createdAt: Date
  updatedAt: Date
}

export abstract class FolderRepositoryPort {
  abstract save(folder: Folder): Promise<void>
  abstract findById(id: string): Promise<Folder | null>
  abstract findSummaryById(id: string): Promise<FolderSummary | null>
  abstract findAll(): Promise<FolderSummary[]>
  abstract delete(id: string): Promise<void>
}
