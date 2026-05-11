import { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save, Pencil, Download, Loader2 } from "lucide-react";

import { useFolders } from "@/shared/hooks/use-folders";
import {
  useVaultFile,
  useVaultFileHistory,
  useUpdateVaultFile,
} from "@/shared/hooks/use-vault-files";
import { useAuth } from "@/shared/hooks/use-auth";
import { downloadFile } from "@/shared/utils/file-helpers";
import { useVaultStore } from "@/shared/stores/vault-store";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { CodeBlock } from "@/shared/components/code-block";
import { FileHistoryList } from "./components/env-history";

export function FileEditorPage() {
  const { folderId, fileId } = useParams<{
    folderId: string;
    fileId: string;
  }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const isViewMode = searchParams.get("mode") === "view";
  const { isUnlocked, vaultPassword } = useVaultStore(folderId);

  const { folders } = useFolders();
  const folder = folders.find((f) => f.id === folderId);

  const { file, isLoading: isLoadingFile } = useVaultFile({
    folderId,
    fileId,
    vaultPassword,
  });
  const { history } = useVaultFileHistory(folderId, fileId);
  const updateFileMutation = useUpdateVaultFile();

  const [content, setContent] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (file && !initialized) {
      setContent(file.content);
      setInitialized(true);
    }
  }, [file, initialized]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineCount = content.split("\n").length;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  if (!isUnlocked) {
    navigate(`/folders/${folderId}`, { replace: true });
    return null;
  }

  if (isLoadingFile) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!file || !folder) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">Arquivo não encontrado.</p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => navigate(`/folders/${folderId}`)}
        >
          <ArrowLeft className="size-4" />
          Voltar para pasta
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    if (!folderId || !fileId || !vaultPassword) return;
    updateFileMutation.mutate({
      folderId,
      fileId,
      content,
      vaultPassword,
    });
  };

  const handleSwitchToEdit = () => {
    navigate(`/folders/${folderId}/file/${fileId}`, { replace: true });
  };

  const handleDownload = () => {
    downloadFile(file.name, content);
  };

  const handleScrollSync = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const lineNumbers = target.previousElementSibling;
    if (lineNumbers) {
      lineNumbers.scrollTop = target.scrollTop;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate(`/folders/${folderId}`)}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {file.name}
            </h1>
            {isViewMode && (
              <Badge variant="secondary">Somente Leitura</Badge>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {folder.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="size-4" />
            Download
          </Button>
          {isViewMode ? (
            <Button size="sm" variant="outline" onClick={handleSwitchToEdit}>
              <Pencil className="size-4" />
              Editar
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateFileMutation.isPending}
            >
              <Save className="size-4" />
              {updateFileMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue={isViewMode ? "viewer" : "editor"}>
        <TabsList variant="line">
          {isViewMode ? (
            <TabsTrigger value="viewer">Visualizar</TabsTrigger>
          ) : (
            <TabsTrigger value="editor">Editor</TabsTrigger>
          )}
          <TabsTrigger value="history">
            Histórico ({history.length})
          </TabsTrigger>
        </TabsList>

        {isViewMode ? (
          <TabsContent value="viewer" className="mt-4">
            <CodeBlock
              code={content}
              filename={file.name}
            />
          </TabsContent>
        ) : (
          <TabsContent value="editor" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="flex overflow-hidden rounded-xl">
                  <div className="hidden sm:flex flex-col items-end overflow-hidden border-r border-border bg-muted/50 px-3 py-4 select-none">
                    {Array.from({ length: lineCount }, (_, i) => (
                      <span
                        key={i}
                        className="font-mono text-xs leading-6 text-muted-foreground/60"
                      >
                        {i + 1}
                      </span>
                    ))}
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onScroll={handleScrollSync}
                    className="flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground"
                    rows={Math.max(lineCount, 12)}
                    spellCheck={false}
                    placeholder="Comece a digitar..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Alterações</CardTitle>
            </CardHeader>
            <CardContent>
              <FileHistoryList history={history} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
