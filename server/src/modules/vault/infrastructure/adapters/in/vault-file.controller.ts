import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'
import type { TokenPayload } from '../../../../../shared/application/ports/out/token.port'
import { CurrentUser } from '../../../../../shared/infrastructure/auth/current-user.decorator'
import { JwtAuthGuard } from '../../../../../shared/infrastructure/auth/jwt-auth.guard'
import { VaultFileRepositoryPort } from '../../../application/ports/out/vault-file-repository.port'
import { CreateVaultFileUseCase } from '../../../application/use-cases/create-vault-file.use-case'
import { DeleteVaultFileUseCase } from '../../../application/use-cases/delete-vault-file.use-case'
import { GetVaultFileUseCase } from '../../../application/use-cases/get-vault-file.use-case'
import { ListVaultFilesUseCase } from '../../../application/use-cases/list-vault-files.use-case'
import { UpdateVaultFileUseCase } from '../../../application/use-cases/update-vault-file.use-case'
import { VaultPassword } from './decorators/vault-password.decorator'

class CreateFileBody {
  @ApiProperty({ description: 'Nome do arquivo', example: '.env.production' })
  name: string

  @ApiProperty({
    description: 'Conteúdo do arquivo',
    example: 'DATABASE_URL=postgresql://...',
  })
  content: string
}

class UpdateFileBody {
  @ApiProperty({
    description: 'Novo conteúdo do arquivo',
    example: 'DATABASE_URL=postgresql://...',
  })
  content: string
}

class VaultFileResponse {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  folderId: string

  @ApiProperty({ example: '.env.production' })
  name: string

  @ApiProperty({ example: 'DATABASE_URL=postgresql://...' })
  content: string

  @ApiProperty({ example: 256 })
  size: number

  @ApiProperty({ example: '2026-02-22T14:30:00.000Z' })
  lastModifiedAt: string

  @ApiProperty({ example: 'Luciano Souza' })
  lastEditorName: string

  @ApiProperty({ example: 'https://avatars.githubusercontent.com/u/...' })
  lastEditorAvatar: string

  @ApiProperty({ example: '2026-02-22T14:30:00.000Z' })
  createdAt: string
}

class FileSummaryResponse {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string

  @ApiProperty({ example: '.env.production' })
  name: string

  @ApiProperty({ example: 256 })
  size: number

  @ApiProperty({ example: '2026-02-22T14:30:00.000Z' })
  lastModifiedAt: string

  @ApiProperty({ example: 'Luciano Souza' })
  lastEditorName: string

  @ApiProperty({ example: 'https://avatars.githubusercontent.com/u/...' })
  lastEditorAvatar: string

  @ApiProperty({ example: '2026-02-22T14:30:00.000Z' })
  createdAt: string
}

class FileHistoryResponse {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  fileId: string

  @ApiProperty({ example: 'Luciano Souza' })
  author: string

  @ApiProperty({ example: 'https://avatars.githubusercontent.com/u/...' })
  authorAvatar: string

  @ApiProperty({ example: '2026-02-22T14:30:00.000Z' })
  editedAt: string
}

@ApiTags('Vault Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('folders/:folderId/files')
export class VaultFileController {
  constructor(
    private readonly createFile: CreateVaultFileUseCase,
    private readonly getFile: GetVaultFileUseCase,
    private readonly listFiles: ListVaultFilesUseCase,
    private readonly updateFile: UpdateVaultFileUseCase,
    private readonly deleteFile: DeleteVaultFileUseCase,
    private readonly fileRepository: VaultFileRepositoryPort
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo arquivo encriptado' })
  @ApiHeader({ name: 'x-vault-password', required: true })
  @ApiCreatedResponse({ type: VaultFileResponse })
  async create(
    @Param('folderId') folderId: string,
    @CurrentUser() tokenPayload: TokenPayload,
    @VaultPassword() vaultPassword: string,
    @Body() body: CreateFileBody
  ) {
    const result = await this.createFile.execute({
      folderId,
      name: body.name,
      content: body.content,
      userId: tokenPayload.sub,
      vaultPassword,
    })

    return {
      id: result.id,
      folderId: result.folderId,
      name: result.name,
      content: body.content,
      size: result.size,
      lastModifiedAt: result.createdAt.toISOString(),
      lastEditorName: tokenPayload.username,
      lastEditorAvatar: '',
      createdAt: result.createdAt.toISOString(),
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lista arquivos de uma pasta (metadata)' })
  @ApiOkResponse({ type: [FileSummaryResponse] })
  async list(@Param('folderId') folderId: string) {
    const files = await this.listFiles.execute({ folderId })

    return files.map((file) => ({
      id: file.id,
      name: file.name,
      size: file.size,
      lastModifiedAt: file.updatedAt.toISOString(),
      lastEditorName: file.lastEditedByName,
      lastEditorAvatar: file.lastEditedByAvatar ?? '',
      createdAt: file.createdAt.toISOString(),
    }))
  }

  @Get(':fileId')
  @ApiOperation({ summary: 'Lê e decripta um arquivo' })
  @ApiHeader({ name: 'x-vault-password', required: true })
  @ApiOkResponse({ type: VaultFileResponse })
  async findById(
    @Param('folderId') folderId: string,
    @Param('fileId') fileId: string,
    @CurrentUser() tokenPayload: TokenPayload,
    @VaultPassword() vaultPassword: string
  ) {
    const result = await this.getFile.execute({
      fileId,
      userId: tokenPayload.sub,
      vaultPassword,
    })

    return {
      id: result.id,
      folderId: result.folderId,
      name: result.name,
      content: result.content,
      size: result.size,
      lastModifiedAt: result.updatedAt.toISOString(),
      lastEditorName: '',
      lastEditorAvatar: '',
      createdAt: result.createdAt.toISOString(),
    }
  }

  @Put(':fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Atualiza conteúdo de um arquivo' })
  @ApiHeader({ name: 'x-vault-password', required: true })
  @ApiNoContentResponse({ description: 'Arquivo atualizado com sucesso' })
  async update(
    @Param('fileId') fileId: string,
    @CurrentUser() tokenPayload: TokenPayload,
    @VaultPassword() vaultPassword: string,
    @Body() body: UpdateFileBody
  ) {
    await this.updateFile.execute({
      fileId,
      content: body.content,
      userId: tokenPayload.sub,
      vaultPassword,
    })
  }

  @Delete(':fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deleta um arquivo' })
  @ApiNoContentResponse({ description: 'Arquivo deletado com sucesso' })
  async remove(
    @Param('fileId') fileId: string,
    @CurrentUser() tokenPayload: TokenPayload
  ) {
    await this.deleteFile.execute({
      userId: tokenPayload.sub,
      fileId,
    })
  }

  @Get(':fileId/history')
  @ApiOperation({ summary: 'Histórico de edições de um arquivo' })
  @ApiOkResponse({ type: [FileHistoryResponse] })
  async history(@Param('fileId') fileId: string) {
    const entries = await this.fileRepository.findHistory(fileId)

    return entries.map((entry) => ({
      id: entry.id,
      fileId,
      author: entry.editedByName,
      authorAvatar: entry.editedByAvatar ?? '',
      editedAt: entry.createdAt.toISOString(),
    }))
  }
}
