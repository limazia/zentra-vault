import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TokenPayload, TokenPort } from '../../application/ports/out/token.port'

@Injectable()
export class JwtTokenAdapter implements TokenPort {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: TokenPayload): string {
    return this.jwtService.sign(payload)
  }

  verify(token: string): TokenPayload {
    return this.jwtService.verify<TokenPayload>(token)
  }
}
