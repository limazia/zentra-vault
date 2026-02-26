import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TokenPort } from '../../application/ports/out/token.port'
import { EnvService } from '../env/env.service'
import { JwtAuthGuard } from './jwt-auth.guard'
import { JwtTokenAdapter } from './jwt-token.adapter'

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        secret: env.get('JWT_SECRET'),
        signOptions: { expiresIn: env.get('JWT_EXPIRATION') as any },
      }),
    }),
  ],
  providers: [{ provide: TokenPort, useClass: JwtTokenAdapter }, JwtAuthGuard],
  exports: [TokenPort, JwtAuthGuard],
})
export class SharedAuthModule {}
