import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'
import type { TokenPayload } from '../../../../../shared/application/ports/out/token.port'
import { CurrentUser } from '../../../../../shared/infrastructure/auth/current-user.decorator'
import { JwtAuthGuard } from '../../../../../shared/infrastructure/auth/jwt-auth.guard'
import { UserRepositoryPort } from '../../../application/ports/out/user-repository.port'
import { SetVaultPasswordUseCase } from '../../../application/use-cases/set-vault-password.use-case'
import { VerifyVaultPasswordUseCase } from '../../../application/use-cases/verify-vault-password.use-case'
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception'

class SetVaultPasswordBody {
  @ApiProperty({
    description: 'Senha do vault a ser configurada',
    example: 'mY$ecureP@ss123',
  })
  password: string
}

class VerifyVaultPasswordBody {
  @ApiProperty({
    description: 'Senha do vault a ser verificada',
    example: 'mY$ecureP@ss123',
  })
  password: string
}

class UserProfileResponse {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string

  @ApiProperty({ example: 'Luciano Souza' })
  name: string

  @ApiProperty({ example: null, nullable: true })
  email: string | null

  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/144965316?v=4',
    nullable: true,
  })
  avatarUrl: string | null

  @ApiProperty({ example: false })
  hasVaultPassword: boolean
}

class SetVaultPasswordResponse {
  @ApiProperty({ example: 'Senha do vault configurada com sucesso' })
  message: string
}

class VerifyVaultPasswordResponse {
  @ApiProperty({
    example: true,
    description: 'Indica se a senha fornecida é válida',
  })
  valid: boolean
}

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly setVaultPassword: SetVaultPasswordUseCase,
    private readonly verifyVaultPassword: VerifyVaultPasswordUseCase
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Retorna o perfil do usuário autenticado' })
  @ApiOkResponse({ type: UserProfileResponse })
  async me(@CurrentUser() tokenPayload: TokenPayload) {
    const user = await this.userRepository.findById(tokenPayload.sub)

    if (!user) {
      throw new UserNotFoundException()
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      hasVaultPassword: user.hasVaultPassword,
    }
  }

  @Post('vault-password')
  @ApiOperation({ summary: 'Configura a senha do vault (uma única vez)' })
  @ApiOkResponse({ type: SetVaultPasswordResponse })
  async setPassword(
    @CurrentUser() tokenPayload: TokenPayload,
    @Body() body: SetVaultPasswordBody
  ) {
    await this.setVaultPassword.execute({
      userId: tokenPayload.sub,
      password: body.password,
    })

    return { message: 'Senha do vault configurada com sucesso' }
  }

  @Post('vault-password/verify')
  @ApiOperation({ summary: 'Verifica a senha do vault' })
  @ApiOkResponse({ type: VerifyVaultPasswordResponse })
  async verifyPassword(
    @CurrentUser() tokenPayload: TokenPayload,
    @Body() body: VerifyVaultPasswordBody
  ) {
    return this.verifyVaultPassword.execute({
      userId: tokenPayload.sub,
      password: body.password,
    })
  }
}
