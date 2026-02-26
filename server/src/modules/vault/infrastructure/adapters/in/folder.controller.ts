import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'
import type { TokenPayload } from '../../../../../shared/application/ports/out/token.port'
import { CurrentUser } from '../../../../../shared/infrastructure/auth/current-user.decorator'
import { JwtAuthGuard } from '../../../../../shared/infrastructure/auth/jwt-auth.guard'
import { CreateFolderUseCase } from '../../../application/use-cases/create-folder.use-case'
import { DeleteFolderUseCase } from '../../../application/use-cases/delete-folder.use-case'
import { GetFolderUseCase } from '../../../application/use-cases/get-folder.use-case'
import { ListFoldersUseCase } from '../../../application/use-cases/list-folders.use-case'

class CreateFolderBody {
  @ApiProperty({
    description: 'Nome da pasta',
    example: 'Production API',
  })
  name: string

  @ApiProperty({
    description: 'Descrição da pasta',
    example: 'Variáveis de ambiente para serviços de API de produção',
    required: false,
  })
  description?: string
}

class FolderResponse {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string

  @ApiProperty({ example: 'Production API' })
  name: string

  @ApiProperty({
    example: 'Variáveis de ambiente para serviços de API de produção',
  })
  description: string

  @ApiProperty({ example: 0 })
  envCount: number

  @ApiProperty({ example: '2026-02-22T14:30:00.000Z' })
  lastUpdatedAt: string

  @ApiProperty({ example: 'Luciano Souza' })
  createdBy: string

  @ApiProperty({ example: '2026-02-22T14:30:00.000Z' })
  createdAt: string
}

@ApiTags('Folders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FolderController {
  constructor(
    private readonly createFolder: CreateFolderUseCase,
    private readonly listFolders: ListFoldersUseCase,
    private readonly getFolder: GetFolderUseCase,
    private readonly deleteFolder: DeleteFolderUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova pasta' })
  @ApiCreatedResponse({ type: FolderResponse })
  async create(
    @CurrentUser() tokenPayload: TokenPayload,
    @Body() body: CreateFolderBody
  ) {
    const folder = await this.createFolder.execute({
      userId: tokenPayload.sub,
      name: body.name,
      description: body.description,
    })

    return {
      id: folder.id,
      name: folder.name,
      description: folder.description,
      envCount: 0,
      lastUpdatedAt: folder.updatedAt.toISOString(),
      createdBy: tokenPayload.username,
      createdAt: folder.createdAt.toISOString(),
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as pastas' })
  @ApiOkResponse({ type: [FolderResponse] })
  async list() {
    const folders = await this.listFolders.execute()

    return folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      description: folder.description,
      envCount: folder.envCount,
      lastUpdatedAt: folder.updatedAt.toISOString(),
      createdBy: folder.createdByName,
      createdAt: folder.createdAt.toISOString(),
    }))
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém uma pasta por ID' })
  @ApiOkResponse({ type: FolderResponse })
  async findById(@Param('id') id: string) {
    const folder = await this.getFolder.execute({ folderId: id })

    return {
      id: folder.id,
      name: folder.name,
      description: folder.description,
      envCount: folder.envCount,
      lastUpdatedAt: folder.updatedAt.toISOString(),
      createdBy: folder.createdByName,
      createdAt: folder.createdAt.toISOString(),
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deleta uma pasta' })
  @ApiNoContentResponse({ description: 'Pasta deletada com sucesso' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() tokenPayload: TokenPayload
  ) {
    await this.deleteFolder.execute({
      userId: tokenPayload.sub,
      folderId: id,
    })
  }
}
