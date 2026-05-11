import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  FileKey2,
  FileCode2,
  ShieldCheck,
  FileJson2,
  File,
  Pencil,
  Trash2,
  Eye,
  Clock,
  User,
  Plus,
  Download,
  Lock,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { FileCategory } from "@/shared/types";
import { useFolders } from "@/shared/hooks/use-folders";
import {
  useVaultFiles,
  useCreateVaultFile,
  useDeleteVaultFile,
} from "@/shared/hooks/use-vault-files";
import { getFileCategory, formatFileSize, downloadFile } from "@/shared/utils/file-helpers";
import { useVaultStore, unlockFolder } from "@/shared/stores/vault-store";
import {
  createFileSchema,
  type CreateFileFormData,
} from "./schemas/create-env.schema";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { UploadFileModal } from "./components/upload-file-modal";
import { UnlockFolderModal } from "./components/unlock-folder-modal";
import type { FileSummary } from "@/shared/http/vault-files";

const FILE_ICON_CONFIG: Record<FileCategory, { icon: React.ElementType; className: string }> = {
  env: { icon: FileKey2, className: "bg-emerald-500/10 text-emerald-500" },
  code: { icon: FileCode2, className: "bg-blue-500/10 text-blue-500" },
  certificate: { icon: ShieldCheck, className: "bg-amber-500/10 text-amber-500" },
  config: { icon: FileJson2, className: "bg-violet-500/10 text-violet-500" },
  other: { icon: File, className: "bg-muted text-muted-foreground" },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCategoryLabel(category: FileCategory): string {
  const labels: Record<FileCategory, string> = {
    env: "Ambiente",
    code: "Código",
    certificate: "Certificado",
    config: "Configuração",
    other: "Arquivo",
  };
  return labels[category];
}

export function FolderDetailPage() {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();

  const { folders, isLoading: isLoadingFolders } = useFolders();
  const folder = folders.find((f) => f.id === folderId);

  const { isUnlocked, vaultPassword } = useVaultStore(folderId);
  const [showUnlockModal, setShowUnlockModal] = useState(!isUnlocked);

  const { files, isLoading: isLoadingFiles } = useVaultFiles(
    isUnlocked ? folderId : undefined,
  );

  const createFileMutation = useCreateVaultFile();
  const deleteFileMutation = useDeleteVaultFile();

  const [createFileOpen, setCreateFileOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FileSummary | null>(null);

  const fileForm = useForm<CreateFileFormData>({
    resolver: zodResolver(createFileSchema),
    mode: "onChange",
    defaultValues: { name: "" },
  });

  if (isLoadingFolders) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">Pasta não encontrada.</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/folders")}>
          <ArrowLeft className="size-4" />
          Voltar para pastas
        </Button>
      </div>
    );
  }

  const handleUnlock = (password: string) => {
    unlockFolder(folderId!, password);
    setShowUnlockModal(false);
  };

  const handleUnlockCancel = () => {
    navigate("/folders");
  };

  const handleDelete = () => {
    if (!deleteTarget || !folderId) return;
    deleteFileMutation.mutate(
      { folderId, fileId: deleteTarget.id },
      { onSuccess: () => setDeleteTarget(null) },
    );
  };

  const handleCreateFile = (data: CreateFileFormData) => {
    if (!folderId || !vaultPassword) return;
    createFileMutation.mutate(
      { folderId, name: data.name, content: "", vaultPassword },
      {
        onSuccess: () => {
          fileForm.reset();
          setCreateFileOpen(false);
        },
      },
    );
  };

  const handleUploadFile = (uploaded: { name: string; content: string; size: number }) => {
    if (!folderId || !vaultPassword) return;
    createFileMutation.mutate({
      folderId,
      name: uploaded.name,
      content: uploaded.content,
      vaultPassword,
    });
  };

  const handleCreateFileOpenChange = (value: boolean) => {
    if (!value) fileForm.reset();
    setCreateFileOpen(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate("/folders")}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {folder.name}
            </h1>
            {isUnlocked && (
              <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-500/30 bg-emerald-500/5 dark:text-emerald-400">
                Desbloqueada
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {folder.description}
          </p>
        </div>
        {isUnlocked && (
          <div className="flex items-center gap-2">
            <UploadFileModal onUpload={handleUploadFile} />
            <Dialog open={createFileOpen} onOpenChange={handleCreateFileOpenChange}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="size-4" />
                  Novo Arquivo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={fileForm.handleSubmit(handleCreateFile)}>
                  <DialogHeader>
                    <DialogTitle>Criar novo arquivo</DialogTitle>
                    <DialogDescription>
                      Crie um novo arquivo nesta pasta. Suporta .env, .ts, .js,
                      .json, .yml, .pem e outros.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-4">
                    <Label htmlFor="file-name">Nome do arquivo</Label>
                    <Input
                      id="file-name"
                      placeholder="ex: .env.production, config.ts, cert.pem"
                      aria-invalid={!!fileForm.formState.errors.name}
                      autoFocus
                      {...fileForm.register("name")}
                    />
                    {fileForm.formState.errors.name && (
                      <p className="text-sm text-destructive">
                        {fileForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleCreateFileOpenChange(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={!fileForm.formState.isValid || createFileMutation.isPending}>
                      {createFileMutation.isPending ? "Criando..." : "Criar"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {!isUnlocked ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/10">
              <Lock className="size-7 text-amber-500" />
            </div>
            <h3 className="mt-5 text-base font-medium">Vault protegido</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              Digite sua senha do vault para acessar o conteúdo desta pasta.
            </p>
            <Button
              className="mt-5"
              size="sm"
              onClick={() => setShowUnlockModal(true)}
            >
              Desbloquear
            </Button>
          </CardContent>
        </Card>
      ) : isLoadingFiles ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">
          <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
            <File className="size-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-sm font-medium">Nenhum arquivo</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Crie ou envie seu primeiro arquivo nesta pasta.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file) => {
            const category = getFileCategory(file.name);
            const iconConfig = FILE_ICON_CONFIG[category];
            const FileIcon = iconConfig.icon;

            return (
              <Card key={file.id} size="sm">
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconConfig.className.split(" ")[0]}`}
                    >
                      <FileIcon
                        className={`size-4 ${iconConfig.className.split(" ").slice(1).join(" ")}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">{file.name}</p>
                        <Badge variant="secondary" className="shrink-0">
                          {getCategoryLabel(category)}
                        </Badge>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatDate(file.lastModifiedAt)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <User className="size-3" />
                          {file.lastEditorName}
                        </span>
                        {file.size > 0 && (
                          <span>{formatFileSize(file.size)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <Link to={`/folders/${folderId}/file/${file.id}?mode=view`}>
                      <Button variant="ghost" size="icon-sm" title="Visualizar">
                        <Eye className="size-4" />
                      </Button>
                    </Link>
                    <Link to={`/folders/${folderId}/file/${file.id}`}>
                      <Button variant="ghost" size="icon-sm" title="Editar">
                        <Pencil className="size-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(file)}
                      title="Excluir"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => {
          if (!v) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir arquivo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.name}
              </span>
              ? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="ghost">Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showUnlockModal && !isUnlocked && (
        <UnlockFolderModal
          open
          onUnlock={handleUnlock}
          onCancel={handleUnlockCancel}
        />
      )}
    </div>
  );
}
