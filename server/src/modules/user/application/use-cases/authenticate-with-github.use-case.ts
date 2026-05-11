import { Injectable } from '@nestjs/common'
import { TokenPort } from '../../../../shared/application/ports/out/token.port'
import { EnvService } from '../../../../shared/infrastructure/env/env.service'
import { GitHubAuthFailedException } from '../../domain/exceptions/github-auth-failed.exception'
import { OrganizationAccessDeniedException } from '../../domain/exceptions/organization-access-denied.exception'
import { AuthResultDto } from '../dtos/auth-result.dto'
import { AuthUserDto } from '../dtos/auth-user.dto'
import { GitHubAuthPort } from '../ports/out/github-auth.port'
import { FindOrCreateUserFromProviderUseCase } from './find-or-create-user-from-provider.use-case'

interface AuthenticateWithGithubCommand {
  code: string
}

@Injectable()
export class AuthenticateWithGithubUseCase {
  constructor(
    private readonly githubAuth: GitHubAuthPort,
    private readonly token: TokenPort,
    private readonly env: EnvService,
    private readonly findOrCreateUser: FindOrCreateUserFromProviderUseCase
  ) {}

  async execute(
    command: AuthenticateWithGithubCommand
  ): Promise<AuthResultDto> {
    const accessToken = await this.githubAuth
      .exchangeCodeForToken(command.code)
      .catch(() => {
        throw new GitHubAuthFailedException()
      })

    const githubUser = await this.githubAuth.getUser(accessToken)

    const organization = this.env.get('GITHUB_ORG')

    const isMember = await this.githubAuth.isOrganizationMember({
      accessToken,
      organization,
    })

    if (!isMember) {
      throw new OrganizationAccessDeniedException({
        username: githubUser.login,
        organization,
      })
    }

    const { user } = await this.findOrCreateUser.execute({
      provider: 'github',
      providerUserId: String(githubUser.id),
      providerUsername: githubUser.login,
      providerAvatarUrl: githubUser.avatarUrl,
      name: githubUser.name,
      avatarUrl: githubUser.avatarUrl,
    })

    const jwt = this.token.sign({
      sub: user.id,
      username: user.name,
    })

    return new AuthResultDto({
      accessToken: jwt,
      user: new AuthUserDto({
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        githubUsername: githubUser.login,
        hasVaultPassword: user.hasVaultPassword,
      }),
    })
  }
}
