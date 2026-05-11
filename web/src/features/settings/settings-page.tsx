import {
  Github,
  Bell,
  Lock,
  Check,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import { useAuth } from "@/shared/hooks/use-auth";

import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/shared/components/ui/card";

export function SettingsPage() {
  const { user, hasVaultPassword } = useAuth();

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie sua conta e preferências do aplicativo.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Github className="size-5 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <CardTitle>Perfil</CardTitle>
                <CardDescription className="mt-1">
                  Suas informações de conta do GitHub.
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Avatar size="lg">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    @{user.githubUsername}
                  </p>
                  {user.email && (
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex gap-3">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${hasVaultPassword ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
              <Lock className={`size-5 ${hasVaultPassword ? "text-emerald-500" : "text-amber-500"}`} />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <CardTitle>Chave do Vault</CardTitle>
                <CardDescription className="mt-1">
                  Sua chave de criptografia para acessar os arquivos protegidos.
                </CardDescription>
              </div>

              {hasVaultPassword ? (
                <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                  <ShieldCheck className="size-5 shrink-0 text-emerald-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                      Chave configurada
                    </p>
                    <p className="mt-0.5 text-xs text-emerald-600/80 dark:text-emerald-400/70">
                      Sua chave foi definida durante o primeiro acesso e não pode
                      ser alterada ou recuperada.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="gap-1.5 shrink-0"
                  >
                    <Check className="size-3.5" />
                    Ativa
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3">
                  <AlertTriangle className="size-5 shrink-0 text-amber-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                      Pendente de configuração
                    </p>
                    <p className="mt-0.5 text-xs text-amber-600/80 dark:text-amber-400/70">
                      Confirme a chave gerada no modal de configuração para
                      ativar o acesso ao Vault.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
              <Bell className="size-5 text-violet-500" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <CardTitle>Notificações</CardTitle>
                <CardDescription className="mt-1">
                  Configure como você recebe notificações sobre alterações.
                </CardDescription>
              </div>
              {[
                {
                  label: "Alterações de ambiente",
                  description:
                    "Seja notificado quando arquivos env forem modificados",
                },
                {
                  label: "Alertas de segurança",
                  description:
                    "Seja notificado sobre eventos relacionados à segurança",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex size-9 items-center justify-center rounded-lg bg-red-500/10">
                    <div className="size-2 rounded-full bg-red-500" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
