import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FolderClosed, FileKey2, Clock, Loader2 } from "lucide-react";

import { useFolders, useCreateFolder } from "@/shared/hooks/use-folders";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { lockVault } from "@/shared/stores/vault-store";
import { CreateFolderModal } from "./components/create-folder-modal";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function FoldersPage() {
  useEffect(() => { lockVault(); }, []);

  const { folders, isLoading } = useFolders();
  const createFolder = useCreateFolder();

  const handleCreateFolder = (name: string, description: string) => {
    createFolder.mutate({ name, description });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pastas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie suas pastas de variáveis de ambiente.
          </p>
        </div>
        <CreateFolderModal onCreateFolder={handleCreateFolder} />
      </div>

      {folders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">
          <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
            <FolderClosed className="size-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-sm font-medium">Nenhuma pasta ainda</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Crie sua primeira pasta para começar a organizar variáveis de ambiente.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((folder) => (
            <Link key={folder.id} to={`/folders/${folder.id}`}>
              <Card className="h-full transition-all hover:border-foreground/20 hover:shadow-md cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                      <FolderClosed className="size-5 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="mt-1">{folder.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {folder.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <FileKey2 className="size-3.5" />
                      {folder.envCount} arquivos env
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {formatDate(folder.lastUpdatedAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
