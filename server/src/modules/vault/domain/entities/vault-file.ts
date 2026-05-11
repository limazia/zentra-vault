type CreateVaultFileProps = {
  folderId: string
  name: string
  size: number
  createdById: string
}

type ReconstituteVaultFileProps = {
  id: string
  folderId: string
  name: string
  size: number
  createdById: string
  lastEditedById: string
  createdAt: Date
  updatedAt: Date
}

export class VaultFile {
  private _id: string
  private _folderId: string
  private _name: string
  private _size: number
  private _createdById: string
  private _lastEditedById: string
  private _createdAt: Date
  private _updatedAt: Date

  private constructor() {}

  static create(props: CreateVaultFileProps): VaultFile {
    const file = new VaultFile()
    file._id = crypto.randomUUID()
    file._folderId = props.folderId
    file._name = props.name
    file._size = props.size
    file._createdById = props.createdById
    file._lastEditedById = props.createdById
    file._createdAt = new Date()
    file._updatedAt = new Date()
    return file
  }

  static reconstitute(props: ReconstituteVaultFileProps): VaultFile {
    const file = new VaultFile()
    file._id = props.id
    file._folderId = props.folderId
    file._name = props.name
    file._size = props.size
    file._createdById = props.createdById
    file._lastEditedById = props.lastEditedById
    file._createdAt = props.createdAt
    file._updatedAt = props.updatedAt
    return file
  }

  get id(): string {
    return this._id
  }

  get folderId(): string {
    return this._folderId
  }

  get name(): string {
    return this._name
  }

  get size(): number {
    return this._size
  }

  get createdById(): string {
    return this._createdById
  }

  get lastEditedById(): string {
    return this._lastEditedById
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }
}
