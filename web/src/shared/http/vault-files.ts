import { api } from "@/shared/lib/axios";
import type { VaultFile, FileHistory } from "@/shared/types";

export interface FileSummary {
  id: string;
  name: string;
  size: number;
  lastModifiedAt: string;
  lastEditorName: string;
  lastEditorAvatar: string;
  createdAt: string;
}

interface CreateFileParams {
  folderId: string;
  name: string;
  content: string;
  vaultPassword: string;
}

interface GetFileParams {
  folderId: string;
  fileId: string;
  vaultPassword: string;
}

interface UpdateFileParams {
  folderId: string;
  fileId: string;
  content: string;
  vaultPassword: string;
}

interface DeleteFileParams {
  folderId: string;
  fileId: string;
}

interface GetFileHistoryParams {
  folderId: string;
  fileId: string;
}

export async function listFiles(folderId: string): Promise<FileSummary[]> {
  const { data } = await api.get<FileSummary[]>(
    `/folders/${folderId}/files`,
  );
  return data;
}

export async function createFile(
  params: CreateFileParams,
): Promise<VaultFile> {
  const { data } = await api.post<VaultFile>(
    `/folders/${params.folderId}/files`,
    { name: params.name, content: params.content },
    { headers: { "x-vault-password": params.vaultPassword } },
  );
  return data;
}

export async function getFile(params: GetFileParams): Promise<VaultFile> {
  const { data } = await api.get<VaultFile>(
    `/folders/${params.folderId}/files/${params.fileId}`,
    { headers: { "x-vault-password": params.vaultPassword } },
  );
  return data;
}

export async function updateFile(params: UpdateFileParams): Promise<void> {
  await api.put(
    `/folders/${params.folderId}/files/${params.fileId}`,
    { content: params.content },
    { headers: { "x-vault-password": params.vaultPassword } },
  );
}

export async function deleteFile(params: DeleteFileParams): Promise<void> {
  await api.delete(`/folders/${params.folderId}/files/${params.fileId}`);
}

export async function getFileHistory(
  params: GetFileHistoryParams,
): Promise<FileHistory[]> {
  const { data } = await api.get<FileHistory[]>(
    `/folders/${params.folderId}/files/${params.fileId}/history`,
  );
  return data;
}
