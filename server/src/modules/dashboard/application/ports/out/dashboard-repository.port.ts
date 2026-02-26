export type DashboardStats = {
  totalFolders: number
  totalFiles: number
  totalMembers: number
  totalAuditEvents: number
}

export type RecentFolder = {
  id: string
  name: string
  envCount: number
  lastUpdatedAt: string
}

export type RecentActivity = {
  id: string
  userId: string
  userName: string
  userAvatar: string | null
  action: string
  folderName: string
  fileName: string
  timestamp: string
}

export type DashboardData = {
  stats: DashboardStats
  recentFolders: RecentFolder[]
  recentActivity: RecentActivity[]
}

export abstract class DashboardRepositoryPort {
  abstract getDashboardData(): Promise<DashboardData>
}
