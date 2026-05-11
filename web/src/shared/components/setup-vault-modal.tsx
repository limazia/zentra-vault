import { useState, useCallback } from "react";
import {
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import posthog from "posthog-js";

import { useAuth } from "@/shared/hooks/use-auth";
import { generatePassword } from "@/shared/utils/generate-password";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";

export function SetupVaultModal() {
  const { hasVaultPassword, setVaultPassword } = useAuth();

  const [password, setPassword] = useState(() => generatePassword());
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleRegenerate = useCallback(() => {
    setPassword(generatePassword());
    setConfirmed(false);
    setCopied(false);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [password]);

  const handleSave = useCallback(async () => {
    if (!confirmed) return;

    setSaving(true);
    try {
      await setVaultPassword(password);
      posthog.capture("vault_password_setup_completed");
      toast.success("Chave do Vault salva com sucesso. Guarde-a em local seguro.");
    } catch {
      toast.error("Erro ao salvar a chave do Vault. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }, [confirmed, password, setVaultPassword]);

  if (hasVaultPassword) return null;

  return (
    <Dialog open modal>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-lg"
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
              <ShieldCheck className="size-5 text-amber-500" />
            </div>
            <DialogTitle className="text-lg">
              Configure sua chave do Vault
            </DialogTitle>
          </div>
          <DialogDescription>
            Esta é sua chave de criptografia para acessar os arquivos protegidos.
            Ela foi gerada automaticamente para garantir máxima segurança.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Sua chave de acesso</Label>
            <div className="flex gap-2">
              <Input
                value={password}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="size-4 text-emerald-500" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRegenerate}
                className="shrink-0"
              >
                <RefreshCw className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2.5">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Esta chave{" "}
              <span className="font-semibold">
                não pode ser recuperada, visualizada novamente ou alterada
              </span>{" "}
              após salvar. Copie e guarde-a em um local seguro antes de
              continuar.
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <Checkbox
              checked={confirmed}
              onCheckedChange={(v) => setConfirmed(v === true)}
              className="mt-0.5"
            />
            <span className="text-sm text-muted-foreground leading-snug">
              Eu entendo que esta chave não poderá ser recuperada ou alterada e
              confirmo que já a copiei para um local seguro.
            </span>
          </label>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={!confirmed || saving}>
            Salvar chave do Vault
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
