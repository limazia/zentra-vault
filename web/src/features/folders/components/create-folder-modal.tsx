import { useState } from "react";
import { FolderPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createFolderSchema,
  type CreateFolderFormData,
} from "../schemas/create-folder.schema";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

interface CreateFolderModalProps {
  onCreateFolder: (name: string, description: string) => void;
}

export function CreateFolderModal({ onCreateFolder }: CreateFolderModalProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateFolderFormData>({
    resolver: zodResolver(createFolderSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: CreateFolderFormData) => {
    onCreateFolder(data.name, data.description ?? "");
    reset();
    setOpen(false);
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) reset();
    setOpen(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <FolderPlus className="size-4" />
          Nova Pasta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Criar nova pasta</DialogTitle>
            <DialogDescription>
              Organize suas variáveis de ambiente em pastas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-3">
              <Label htmlFor="folder-name">Nome da pasta</Label>
              <Input
                id="folder-name"
                placeholder="ex: API de Produção"
                aria-invalid={!!errors.name}
                autoFocus
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <Label htmlFor="folder-description">Descrição</Label>
              <Input
                id="folder-description"
                placeholder="Breve descrição desta pasta"
                aria-invalid={!!errors.description}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid}>
              Criar Pasta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
