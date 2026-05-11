import type { User } from '../../../domain/entities/user'

interface LinkAuthProviderParams {
  userId: string
  provider: string
  providerUserId: string
  providerUsername?: string
  providerAvatarUrl?: string
}

export abstract class UserRepositoryPort {
  abstract save(user: User): Promise<void>
  abstract findById(id: string): Promise<User | null>
  abstract findByAuthProvider(params: {
    provider: string
    providerUserId: string
  }): Promise<User | null>
  abstract linkAuthProvider(params: LinkAuthProviderParams): Promise<void>
}
