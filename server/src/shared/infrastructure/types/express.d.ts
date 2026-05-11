import type { TokenPayload } from '../../application/ports/out/token.port'

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}
