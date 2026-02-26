import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../../../../../shared/infrastructure/auth/jwt-auth.guard'
import { ListAuditLogsUseCase } from '../../../application/use-cases/list-audit-logs.use-case'

class AuditLogResponse {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string

  @ApiProperty({ example: 'usr_01' })
  userId: string

  @ApiProperty({ example: 'Lucas Mazia' })
  userName: string

  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/50751236?v=4',
  })
  userAvatar: string

  @ApiProperty({ example: 'env.create' })
  action: string

  @ApiProperty({ example: 'Production API' })
  folderName: string

  @ApiProperty({ example: '.env.production' })
  fileName: string

  @ApiProperty({ example: '2026-02-18T14:32:00.000Z' })
  timestamp: string
}

@ApiTags('Audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly listAuditLogs: ListAuditLogsUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Lista audit logs com filtros opcionais' })
  @ApiOkResponse({ type: [AuditLogResponse] })
  @ApiQuery({ name: 'q', required: false, description: 'Busca textual' })
  @ApiQuery({
    name: 'action',
    required: false,
    description: 'Filtro por ação (separado por vírgula)',
  })
  async list(@Query('q') search?: string, @Query('action') action?: string) {
    const actions = action
      ? action.split(',').filter((a) => a.trim().length > 0)
      : undefined

    return this.listAuditLogs.execute({
      search: search || undefined,
      actions,
    })
  }
}
