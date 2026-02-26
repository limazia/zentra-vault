import { Module } from '@nestjs/common'
import { DashboardRepositoryPort } from '../application/ports/out/dashboard-repository.port'
import { GetDashboardUseCase } from '../application/use-cases/get-dashboard.use-case'
import { DashboardController } from './adapters/in/dashboard.controller'
import { DashboardDrizzleRepository } from './adapters/out/dashboard-drizzle.repository'

@Module({
  providers: [
    {
      provide: DashboardRepositoryPort,
      useClass: DashboardDrizzleRepository,
    },
    GetDashboardUseCase,
  ],
  controllers: [DashboardController],
})
export class DashboardModule {}
