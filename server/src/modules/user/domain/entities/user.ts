interface CreateUserProps {
  name: string
  email?: string
  avatarUrl?: string
}

interface ReconstituteUserProps {
  id: string
  name: string
  email: string | null
  avatarUrl: string | null
  vaultPasswordHash: string | null
  createdAt: Date
  updatedAt: Date
}

export class User {
  private _id: string
  private _name: string
  private _email: string | null
  private _avatarUrl: string | null
  private _vaultPasswordHash: string | null
  private _createdAt: Date
  private _updatedAt: Date

  private constructor() {}

  static create(props: CreateUserProps): User {
    const user = new User()
    user._id = crypto.randomUUID()
    user._name = props.name
    user._email = props.email ?? null
    user._avatarUrl = props.avatarUrl ?? null
    user._vaultPasswordHash = null
    user._createdAt = new Date()
    user._updatedAt = new Date()
    return user
  }

  static reconstitute(props: ReconstituteUserProps): User {
    const user = new User()
    user._id = props.id
    user._name = props.name
    user._email = props.email
    user._avatarUrl = props.avatarUrl
    user._vaultPasswordHash = props.vaultPasswordHash
    user._createdAt = props.createdAt
    user._updatedAt = props.updatedAt
    return user
  }

  setVaultPasswordHash(hash: string): void {
    this._vaultPasswordHash = hash
    this._updatedAt = new Date()
  }

  get id(): string {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get email(): string | null {
    return this._email
  }

  get avatarUrl(): string | null {
    return this._avatarUrl
  }

  get vaultPasswordHash(): string | null {
    return this._vaultPasswordHash
  }

  get hasVaultPassword(): boolean {
    return this._vaultPasswordHash !== null
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }
}
