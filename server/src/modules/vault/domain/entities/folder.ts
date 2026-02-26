interface CreateFolderProps {
  name: string
  description?: string
  createdById: string
}

interface ReconstituteFolderProps {
  id: string
  name: string
  description: string
  createdById: string
  createdAt: Date
  updatedAt: Date
}

export class Folder {
  private _id: string
  private _name: string
  private _description: string
  private _createdById: string
  private _createdAt: Date
  private _updatedAt: Date

  private constructor() {}

  static create(props: CreateFolderProps): Folder {
    const folder = new Folder()
    folder._id = crypto.randomUUID()
    folder._name = props.name
    folder._description = props.description ?? ''
    folder._createdById = props.createdById
    folder._createdAt = new Date()
    folder._updatedAt = new Date()
    return folder
  }

  static reconstitute(props: ReconstituteFolderProps): Folder {
    const folder = new Folder()
    folder._id = props.id
    folder._name = props.name
    folder._description = props.description
    folder._createdById = props.createdById
    folder._createdAt = props.createdAt
    folder._updatedAt = props.updatedAt
    return folder
  }

  get id(): string {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get description(): string {
    return this._description
  }

  get createdById(): string {
    return this._createdById
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }
}
