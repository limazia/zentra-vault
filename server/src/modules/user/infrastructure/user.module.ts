import { Module } from '@nestjs/common'
import { GitHubAuthPort } from '../application/ports/out/github-auth.port'
import { HashPort } from '../application/ports/out/hash.port'
import { UserRepositoryPort } from '../application/ports/out/user-repository.port'
import { AuthenticateWithGithubUseCase } from '../application/use-cases/authenticate-with-github.use-case'
import { FindOrCreateUserFromProviderUseCase } from '../application/use-cases/find-or-create-user-from-provider.use-case'
import { SetVaultPasswordUseCase } from '../application/use-cases/set-vault-password.use-case'
import { VerifyVaultPasswordUseCase } from '../application/use-cases/verify-vault-password.use-case'
import { AuthController } from './adapters/in/auth.controller'
import { UserController } from './adapters/in/user.controller'
import { BcryptHashAdapter } from './adapters/out/bcrypt-hash.adapter'
import { GitHubApiAdapter } from './adapters/out/github-api.adapter'
import { UserDrizzleRepository } from './adapters/out/user-drizzle.repository'

@Module({
  providers: [
    { provide: UserRepositoryPort, useClass: UserDrizzleRepository },
    { provide: GitHubAuthPort, useClass: GitHubApiAdapter },
    { provide: HashPort, useClass: BcryptHashAdapter },
    AuthenticateWithGithubUseCase,
    FindOrCreateUserFromProviderUseCase,
    SetVaultPasswordUseCase,
    VerifyVaultPasswordUseCase,
  ],
  controllers: [AuthController, UserController],
  exports: [HashPort],
})
export class UserModule {}
