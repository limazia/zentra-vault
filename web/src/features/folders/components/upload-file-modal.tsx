import { useState, useRef, useCallback } from "react";
import { Upload, X, FileUp } from "lucide-react";

import { formatFileSize } from "@/shared/utils/file-helpers";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

interface UploadFileModalProps {
  onUpload: (file: { name: string; content: string; size: number }) => void;
}

export function UploadFileModal({ onUpload }: UploadFileModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setSelectedFile(null);
    setDragging(false);
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) resetState();
    setOpen(value);
  };

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const content = await selectedFile.text();
    onUpload({
      name: selectedFile.name,
      content,
      size: selectedFile.size,
    });
    resetState();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Upload className="size-4" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar arquivo</DialogTitle>
          <DialogDescription>
            Envie um arquivo para esta pasta. Suporta .env, .ts, .js, .pem,
            .crt, .json, .yml e outros.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleInputChange}
          />

          {selectedFile ? (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileUp className="size-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setSelectedFile(null)}
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
                dragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <Upload className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Arraste e solte seu arquivo aqui
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  ou clique para selecionar
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedFile}>
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
