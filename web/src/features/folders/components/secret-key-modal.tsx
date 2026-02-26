import { useState } from "react";
import { KeyRound, Lock, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

const MOCK_SECRET_KEY = "envvault-secret-2026";

interface SecretKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function SecretKeyModal({
  open,
  onOpenChange,
  onSuccess,
}: SecretKeyModalProps) {
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
    defaultValues: {
      key: "",
    },
  });

  const onSubmit = (data: SecretKeyFormData) => {
    setLoading(true);
    setError(false);

    setTimeout(() => {
      if (data.key === MOCK_SECRET_KEY) {
        onSuccess();
        reset();
        onOpenChange(false);
      } else {
        setError(true);
      }
      setLoading(false);
    }, 600);
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      reset();
      setError(false);
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="items-center text-center">
            <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-amber-500/10">
              <Lock className="size-5 text-amber-500" />
            </div>
            <DialogTitle>Chave de Acesso Necessária</DialogTitle>
            <DialogDescription>
              Digite sua chave de acesso secreta para visualizar o conteúdo deste
              ambiente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Digite sua chave de acesso"
                className="pl-9"
                aria-invalid={!!errors.key}
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
                Chave de acesso inválida. Tente novamente.
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Dica: use{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                envvault-secret-2026
              </code>
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
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
