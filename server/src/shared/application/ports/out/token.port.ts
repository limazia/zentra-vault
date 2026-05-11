export interface TokenPayload {
  sub: string
  username: string
}

export abstract class TokenPort {
  abstract sign(payload: TokenPayload): string
  abstract verify(token: string): TokenPayload
}
