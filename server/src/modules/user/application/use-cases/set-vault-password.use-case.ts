import { Injectable } from '@nestjs/common'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { VaultPasswordAlreadySetException } from '../../domain/exceptions/vault-password-already-set.exception'
import { HashPort } from '../ports/out/hash.port'
import { UserRepositoryPort } from '../ports/out/user-repository.port'

interface SetVaultPasswordCommand {
  userId: string
  password: string
}

@Injectable()
export class SetVaultPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly hash: HashPort
  ) {}

  async execute(command: SetVaultPasswordCommand): Promise<void> {
    const user = await this.userRepository.findById(command.userId)

    if (!user) {
      throw new UserNotFoundException()
    }

    if (user.hasVaultPassword) {
      throw new VaultPasswordAlreadySetException()
    }

    const hashed = await this.hash.hash(command.password)
    user.setVaultPasswordHash(hashed)

    await this.userRepository.save(user)
  }
}
