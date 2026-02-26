import { Injectable } from '@nestjs/common'
import { EventPublisherPort } from '../../../../shared/application/ports/out/event-publisher.port'
import { AuditEvent } from '../../../../shared/domain/events/audit.event'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { HashPort } from '../ports/out/hash.port'
import { UserRepositoryPort } from '../ports/out/user-repository.port'

interface VerifyVaultPasswordCommand {
  userId: string
  password: string
}

export interface VerifyVaultPasswordResult {
  valid: boolean
}

@Injectable()
export class VerifyVaultPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly hash: HashPort,
    private readonly eventPublisher: EventPublisherPort
  ) {}

  async execute(
    command: VerifyVaultPasswordCommand
  ): Promise<VerifyVaultPasswordResult> {
    const user = await this.userRepository.findById(command.userId)

    if (!user) {
      throw new UserNotFoundException()
    }

    if (!user.hasVaultPassword || !user.vaultPasswordHash) {
      return { valid: false }
    }

    const valid = await this.hash.compare(
      command.password,
      user.vaultPasswordHash
    )

    if (valid) {
      this.eventPublisher.publish(
        new AuditEvent(command.userId, 'secret.verify')
      )
    }

    return { valid }
  }
}
