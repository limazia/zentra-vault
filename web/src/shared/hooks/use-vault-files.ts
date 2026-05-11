import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  listFiles,
  createFile,
  getFile,
  updateFile,
  deleteFile,
  getFileHistory,
} from "@/shared/http/vault-files";

export function useVaultFiles(folderId: string | undefined) {
  const { data: files, isLoading, isError } = useQuery({
    queryKey: ["vault-files", folderId],
    queryFn: () => listFiles(folderId!),
    enabled: !!folderId,
  });

  return { files: files ?? [], isLoading, isError };
}

export function useVaultFile(params: {
  folderId: string | undefined;
  fileId: string | undefined;
  vaultPassword: string | null;
}) {
  const {
    data: file,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["vault-file", params.fileId],
    queryFn: () =>
      getFile({
        folderId: params.folderId!,
        fileId: params.fileId!,
        vaultPassword: params.vaultPassword!,
      }),
    enabled: !!params.folderId && !!params.fileId && !!params.vaultPassword,
  });

  return { file, isLoading, isError };
}

export function useCreateVaultFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFile,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vault-files", variables.folderId],
      });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Arquivo criado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar arquivo");
    },
  });
}

export function useUpdateVaultFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFile,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vault-file", variables.fileId],
      });
      queryClient.invalidateQueries({
        queryKey: ["vault-file-history", variables.fileId],
      });
      toast.success("Arquivo salvo com sucesso");
    },
    onError: () => {
      toast.error("Erro ao salvar arquivo");
    },
  });
}

export function useDeleteVaultFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFile,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vault-files", variables.folderId],
      });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Arquivo excluído com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir arquivo");
    },
  });
}

export function useVaultFileHistory(
  folderId: string | undefined,
  fileId: string | undefined,
) {
  const { data: history, isLoading, isError } = useQuery({
    queryKey: ["vault-file-history", fileId],
    queryFn: () => getFileHistory({ folderId: folderId!, fileId: fileId! }),
    enabled: !!folderId && !!fileId,
  });

  return { history: history ?? [], isLoading, isError };
}
