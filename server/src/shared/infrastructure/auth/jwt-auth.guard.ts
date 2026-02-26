import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { TokenPort } from '../../application/ports/out/token.port'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly token: TokenPort) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    const authHeader = request.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException()
    }

    try {
      const payload = this.token.verify(authHeader.substring(7))
      request.user = payload
      return true
    } catch {
      throw new UnauthorizedException()
    }
  }
}
