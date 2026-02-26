import { useState } from "react";
import { KeyRound, Lock, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { verifyVaultPassword } from "@/shared/http/vault";
import {
  secretKeySchema,
  type SecretKeyFormData,
} from "../schemas/secret-key.schema";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface UnlockFolderModalProps {
  open: boolean;
  onUnlock: (password: string) => void;
  onCancel: () => void;
}

export function UnlockFolderModal({
  open,
  onUnlock,
  onCancel,
}: UnlockFolderModalProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<SecretKeyFormData>({
    resolver: zodResolver(secretKeySchema),
    mode: "onChange",
    defaultValues: { key: "" },
  });

  const onSubmit = async (data: SecretKeyFormData) => {
    setLoading(true);
    setError(false);

    try {
      const result = await verifyVaultPassword(data.key);

      if (result.valid) {
        reset();
        onUnlock(data.key);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setError(false);
    onCancel();
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-sm"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="items-center text-center">
            <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-amber-500/10">
              <Lock className="size-5 text-amber-500" />
            </div>
            <DialogTitle>Vault Protegido</DialogTitle>
            <DialogDescription>
              Digite sua senha do vault para acessar o conteúdo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Sua senha do vault"
                className="pl-9"
                aria-invalid={!!errors.key || error}
                autoFocus
                {...register("key", {
                  onChange: () => setError(false),
                })}
              />
            </div>
            {errors.key && (
              <p className="text-sm text-destructive">{errors.key.message}</p>
            )}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                Senha incorreta. Tente novamente.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
            >
              Voltar
            </Button>
            <Button type="submit" disabled={!isValid || loading}>
              {loading ? "Verificando..." : "Desbloquear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
