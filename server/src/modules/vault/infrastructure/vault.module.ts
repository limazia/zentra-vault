import { Module } from '@nestjs/common'
import { EnvService } from '../../../shared/infrastructure/env/env.service'
import { UserModule } from '../../user/infrastructure/user.module'
import { EncryptionPort } from '../application/ports/out/encryption.port'
import { FolderRepositoryPort } from '../application/ports/out/folder-repository.port'
import { KeyManagementPort } from '../application/ports/out/key-management.port'
import { VaultFileRepositoryPort } from '../application/ports/out/vault-file-repository.port'
import { VaultKeyRepositoryPort } from '../application/ports/out/vault-key-repository.port'
import { VaultKeyService } from '../application/services/vault-key.service'
import { CreateFolderUseCase } from '../application/use-cases/create-folder.use-case'
import { CreateVaultFileUseCase } from '../application/use-cases/create-vault-file.use-case'
import { DeleteFolderUseCase } from '../application/use-cases/delete-folder.use-case'
import { DeleteVaultFileUseCase } from '../application/use-cases/delete-vault-file.use-case'
import { GetFolderUseCase } from '../application/use-cases/get-folder.use-case'
import { GetVaultFileUseCase } from '../application/use-cases/get-vault-file.use-case'
import { ListFoldersUseCase } from '../application/use-cases/list-folders.use-case'
import { ListVaultFilesUseCase } from '../application/use-cases/list-vault-files.use-case'
import { UpdateVaultFileUseCase } from '../application/use-cases/update-vault-file.use-case'
import { FolderController } from './adapters/in/folder.controller'
import { VaultFileController } from './adapters/in/vault-file.controller'
import { AesGcmEncryptionAdapter } from './adapters/out/aes-gcm-encryption.adapter'
import { AwsKmsKeyManagementAdapter } from './adapters/out/aws-kms-key-management.adapter'
import { FolderDrizzleRepository } from './adapters/out/folder-drizzle.repository'
import { LocalKeyManagementAdapter } from './adapters/out/local-key-management.adapter'
import { VaultFileDrizzleRepository } from './adapters/out/vault-file-drizzle.repository'
import { VaultKeyDrizzleRepository } from './adapters/out/vault-key-drizzle.repository'

@Module({
  imports: [UserModule],
  providers: [
    { provide: FolderRepositoryPort, useClass: FolderDrizzleRepository },
    { provide: VaultFileRepositoryPort, useClass: VaultFileDrizzleRepository },
    { provide: EncryptionPort, useClass: AesGcmEncryptionAdapter },
    { provide: VaultKeyRepositoryPort, useClass: VaultKeyDrizzleRepository },
    {
      provide: KeyManagementPort,
      useFactory: (env: EnvService) => {
        if (env.get('KMS_PROVIDER') === 'aws') {
          return new AwsKmsKeyManagementAdapter(env)
        }
        return new LocalKeyManagementAdapter(env)
      },
      inject: [EnvService],
    },
    VaultKeyService,
    CreateFolderUseCase,
    ListFoldersUseCase,
    GetFolderUseCase,
    DeleteFolderUseCase,
    CreateVaultFileUseCase,
    GetVaultFileUseCase,
    ListVaultFilesUseCase,
    UpdateVaultFileUseCase,
    DeleteVaultFileUseCase,
  ],
  controllers: [FolderController, VaultFileController],
  exports: [VaultKeyService],
})
export class VaultModule {}
