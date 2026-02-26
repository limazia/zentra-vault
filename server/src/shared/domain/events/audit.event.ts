export class AuditEvent {
  constructor(
    public readonly userId: string,
    public readonly action: string,
    public readonly folderId?: string,
    public readonly folderName?: string,
    public readonly fileId?: string,
    public readonly fileName?: string
  ) {}
}
