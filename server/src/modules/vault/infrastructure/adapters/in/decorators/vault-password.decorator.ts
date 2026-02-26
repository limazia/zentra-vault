import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'

export const VaultPassword = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>()
    const vaultPassword = request.headers['x-vault-password']

    if (!vaultPassword || typeof vaultPassword !== 'string') {
      throw new UnauthorizedException('x-vault-password header is required')
    }

    return vaultPassword
  }
)
