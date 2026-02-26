import { ApiProperty } from '@nestjs/swagger'
import { AuthUserDto } from './auth-user.dto'

interface AuthResultProps {
  accessToken: string
  user: AuthUserDto
}

export class AuthResultDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  readonly accessToken: string

  @ApiProperty({ type: AuthUserDto })
  readonly user: AuthUserDto

  constructor(props: AuthResultProps) {
    this.accessToken = props.accessToken
    this.user = props.user
  }
}
