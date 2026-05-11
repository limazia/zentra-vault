import { Injectable } from '@nestjs/common'
import { User } from '../../domain/entities/user'
import { UserRepositoryPort } from '../ports/out/user-repository.port'

interface FindOrCreateUserFromProviderCommand {
  provider: string
  providerUserId: string
  providerUsername: string
  providerAvatarUrl: string
  name: string
  avatarUrl?: string
}

interface FindOrCreateUserFromProviderResult {
  user: User
  isNewUser: boolean
}

@Injectable()
export class FindOrCreateUserFromProviderUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(
    command: FindOrCreateUserFromProviderCommand
  ): Promise<FindOrCreateUserFromProviderResult> {
    const existingUser = await this.userRepository.findByAuthProvider({
      provider: command.provider,
      providerUserId: command.providerUserId,
    })

    if (existingUser) {
      return { user: existingUser, isNewUser: false }
    }

    const user = User.create({
      name: command.name,
      avatarUrl: command.avatarUrl ?? command.providerAvatarUrl,
    })

    await this.userRepository.save(user)

    await this.userRepository.linkAuthProvider({
      userId: user.id,
      provider: command.provider,
      providerUserId: command.providerUserId,
      providerUsername: command.providerUsername,
      providerAvatarUrl: command.providerAvatarUrl,
    })

    return { user, isNewUser: true }
  }
}
