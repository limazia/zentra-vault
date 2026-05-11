interface CreateAuditLogProps {
  userId: string
  action: string
  folderId?: string
  folderName?: string
  fileId?: string
  fileName?: string
}

interface ReconstituteAuditLogProps {
  id: string
  userId: string
  action: string
  folderId: string | null
  folderName: string
  fileId: string | null
  fileName: string
  createdAt: Date
}

export class AuditLog {
  private _id: string
  private _userId: string
  private _action: string
  private _folderId: string | null
  private _folderName: string
  private _fileId: string | null
  private _fileName: string
  private _createdAt: Date

  private constructor() {}

  static create(props: CreateAuditLogProps): AuditLog {
    const log = new AuditLog()
    log._id = crypto.randomUUID()
    log._userId = props.userId
    log._action = props.action
    log._folderId = props.folderId ?? null
    log._folderName = props.folderName ?? '—'
    log._fileId = props.fileId ?? null
    log._fileName = props.fileName ?? '—'
    log._createdAt = new Date()
    return log
  }

  static reconstitute(props: ReconstituteAuditLogProps): AuditLog {
    const log = new AuditLog()
    log._id = props.id
    log._userId = props.userId
    log._action = props.action
    log._folderId = props.folderId
    log._folderName = props.folderName
    log._fileId = props.fileId
    log._fileName = props.fileName
    log._createdAt = props.createdAt
    return log
  }

  get id(): string {
    return this._id
  }

  get userId(): string {
    return this._userId
  }

  get action(): string {
    return this._action
  }

  get folderId(): string | null {
    return this._folderId
  }

  get folderName(): string {
    return this._folderName
  }

  get fileId(): string | null {
    return this._fileId
  }

  get fileName(): string {
    return this._fileName
  }

  get createdAt(): Date {
    return this._createdAt
  }

  setFolderName(name: string): void {
    this._folderName = name
  }
}
