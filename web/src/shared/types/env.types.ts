export type FileCategory = "env" | "code" | "certificate" | "config" | "other";

export interface VaultFile {
  id: string;
  folderId: string;
  name: string;
  content: string;
  size: number;
  lastModifiedAt: string;
  lastEditorName: string;
  lastEditorAvatar: string;
  createdAt: string;
}

export interface FileHistory {
  id: string;
  fileId: string;
  author: string;
  authorAvatar: string;
  editedAt: string;
}
