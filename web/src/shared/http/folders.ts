import { api } from "@/shared/lib/axios";
import type { Folder } from "@/shared/types";

interface CreateFolderParams {
  name: string;
  description?: string;
}

export async function listFolders(): Promise<Folder[]> {
  const { data } = await api.get<Folder[]>("/folders");
  return data;
}

export async function createFolder(
  params: CreateFolderParams,
): Promise<Folder> {
  const { data } = await api.post<Folder>("/folders", params);
  return data;
}

export async function deleteFolder(folderId: string): Promise<void> {
  await api.delete(`/folders/${folderId}`);
}
