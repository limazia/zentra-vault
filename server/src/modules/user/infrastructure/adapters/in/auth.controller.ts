import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import type { TokenPayload } from '../../../../../shared/application/ports/out/token.port'
import { CurrentUser } from '../../../../../shared/infrastructure/auth/current-user.decorator'
import { JwtAuthGuard } from '../../../../../shared/infrastructure/auth/jwt-auth.guard'
import { AuthResultDto } from '../../../application/dtos/auth-result.dto'
import { AuthenticateWithGithubUseCase } from '../../../application/use-cases/authenticate-with-github.use-case'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authenticateWithGithub: AuthenticateWithGithubUseCase
  ) {}

  @Get('github/callback')
  @ApiOperation({
    summary: 'Callback do GitHub OAuth',
    description:
      'Troca o código de autorização por um JWT. Apenas membros da organização configurada têm acesso.',
  })
  @ApiQuery({ name: 'code', description: 'Código de autorização do GitHub' })
  @ApiOkResponse({ type: AuthResultDto })
  async githubCallback(@Query('code') code: string) {
    return this.authenticateWithGithub.execute({ code })
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retorna payload do token do usuário autenticado',
  })
  me(@CurrentUser() user: TokenPayload) {
    return user
  }
}
