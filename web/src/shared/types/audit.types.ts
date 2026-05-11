export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  folderName: string;
  fileName: string;
  timestamp: string;
}
