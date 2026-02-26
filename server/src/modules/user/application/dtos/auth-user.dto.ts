import { ApiProperty } from '@nestjs/swagger'

interface AuthUserDtoProps {
  id: string
  name: string
  avatarUrl: string | null
  githubUsername: string
  hasVaultPassword: boolean
}

export class AuthUserDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  readonly id: string

  @ApiProperty({ example: 'Luciano Souza' })
  readonly name: string

  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/144965316?v=4',
    nullable: true,
  })
  readonly avatarUrl: string | null

  @ApiProperty({ example: 'lucianoRSouzaa' })
  readonly githubUsername: string

  @ApiProperty({ example: false })
  readonly hasVaultPassword: boolean

  constructor(props: AuthUserDtoProps) {
    this.id = props.id
    this.name = props.name
    this.avatarUrl = props.avatarUrl
    this.githubUsername = props.githubUsername
    this.hasVaultPassword = props.hasVaultPassword
  }
}
