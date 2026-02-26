import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'
import { HashPort } from '../../../application/ports/out/hash.port'

const SALT_ROUNDS = 12

@Injectable()
export class BcryptHashAdapter implements HashPort {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS)
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed)
  }
}
