import { Injectable } from '@nestjs/common'
import {
  type DashboardData,
  DashboardRepositoryPort,
} from '../ports/out/dashboard-repository.port'

@Injectable()
export class GetDashboardUseCase {
  constructor(private readonly dashboardRepository: DashboardRepositoryPort) {}

  async execute(): Promise<DashboardData> {
    return this.dashboardRepository.getDashboardData()
  }
}
