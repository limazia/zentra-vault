import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  listFolders,
  createFolder,
  deleteFolder,
} from "@/shared/http/folders";

export function useFolders() {
  const { data: folders, isLoading, isError } = useQuery({
    queryKey: ["folders"],
    queryFn: listFolders,
  });

  return { folders: folders ?? [], isLoading, isError };
}

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Pasta criada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar pasta");
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Pasta excluída com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir pasta");
    },
  });
}
