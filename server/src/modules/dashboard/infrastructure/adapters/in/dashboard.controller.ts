import { Controller, Get, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../../../../../shared/infrastructure/auth/jwt-auth.guard'
import { GetDashboardUseCase } from '../../../application/use-cases/get-dashboard.use-case'

class DashboardStatsResponse {
  @ApiProperty({ example: 5 })
  totalFolders: number

  @ApiProperty({ example: 12 })
  totalFiles: number

  @ApiProperty({ example: 3 })
  totalMembers: number

  @ApiProperty({ example: 47 })
  totalAuditEvents: number
}

class RecentFolderResponse {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string

  @ApiProperty({ example: 'Production API' })
  name: string

  @ApiProperty({ example: 3 })
  envCount: number

  @ApiProperty({ example: '2026-02-22T14:30:00.000Z' })
  lastUpdatedAt: string
}

class RecentActivityResponse {
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

  @ApiProperty({ example: '2026-02-22T14:30:00.000Z' })
  timestamp: string
}

class DashboardResponse {
  @ApiProperty({ type: DashboardStatsResponse })
  stats: DashboardStatsResponse

  @ApiProperty({ type: [RecentFolderResponse] })
  recentFolders: RecentFolderResponse[]

  @ApiProperty({ type: [RecentActivityResponse] })
  recentActivity: RecentActivityResponse[]
}

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly getDashboard: GetDashboardUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Retorna estatísticas e atividade recente' })
  @ApiOkResponse({ type: DashboardResponse })
  async stats() {
    return this.getDashboard.execute()
  }
}
