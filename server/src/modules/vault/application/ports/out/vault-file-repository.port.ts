export type EncryptedFileRecord = {
  id: string
  folderId: string
  name: string
  encryptedContent: string
  contentIv: string
  wrappedDek: string
  dekIv: string
  size: number
  createdById: string
  lastEditedById: string
  createdAt: Date
  updatedAt: Date
}

export type FileSummary = {
  id: string
  name: string
  size: number
  lastEditedByName: string
  lastEditedByAvatar: string | null
  updatedAt: Date
  createdAt: Date
}

export type FileHistoryEntry = {
  id: string
  editedByName: string
  editedByAvatar: string | null
  createdAt: Date
}

type SaveHistoryParams = {
  id: string
  fileId: string
  editedById: string
}

export abstract class VaultFileRepositoryPort {
  abstract save(params: EncryptedFileRecord): Promise<void>
  abstract update(params: EncryptedFileRecord): Promise<void>
  abstract findById(id: string): Promise<EncryptedFileRecord | null>
  abstract findByFolderId(folderId: string): Promise<FileSummary[]>
  abstract delete(id: string): Promise<void>
  abstract countByFolderId(folderId: string): Promise<number>
  abstract findHistory(fileId: string): Promise<FileHistoryEntry[]>
  abstract saveHistory(params: SaveHistoryParams): Promise<void>
}
