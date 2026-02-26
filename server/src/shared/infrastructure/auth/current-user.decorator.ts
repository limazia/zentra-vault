/** biome-ignore-all lint/style/noNonNullAssertion: user is guaranteed to be set by the JwtAuthGuard */
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'
import type { TokenPayload } from '../../application/ports/out/token.port'

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TokenPayload => {
    const request = ctx.switchToHttp().getRequest<Request>()
    return request.user!
  }
)
