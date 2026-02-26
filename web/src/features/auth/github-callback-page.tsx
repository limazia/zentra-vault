import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, Loader2 } from "lucide-react";

import { useAuth } from "@/shared/hooks/use-auth";

import { Logo } from "@/assets";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/shared/components/ui/card";

export function GithubCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { authenticateWithGithub, hasVaultPassword } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const code = searchParams.get("code");

    if (!code) {
      setError("Código de autorização não encontrado na URL.");
      return;
    }

    authenticateWithGithub(code)
      .then(() => {
        navigate(hasVaultPassword ? "/dashboard" : "/settings", {
          replace: true,
        });
      })
      .catch((err) => {
        const message =
          err?.response?.data?.message ||
          "Falha ao autenticar com o GitHub. Tente novamente.";
        setError(message);
      });
  }, [searchParams, authenticateWithGithub, hasVaultPassword, navigate]);

  if (error) {
    return (
      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-4 items-center">
            <Logo className="h-12 w-48 fill-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">
                  Erro na autenticação
                </p>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
            </div>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => navigate("/login", { replace: true })}
            >
              Voltar para o login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col items-center gap-4">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Autenticando com o GitHub...
      </p>
    </div>
  );
}
