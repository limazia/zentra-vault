import { Info } from "lucide-react";

import { useAuth } from "@/shared/hooks/use-auth";

import { GithubIcon, Logo } from "@/assets";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/shared/components/ui/card";

export function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="relative z-10 w-full max-w-md px-4">
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="space-y-4 items-center">
          <Logo className="h-12 w-48 fill-foreground" />
          <CardDescription className="text-balance">
            Autentique-se com o GitHub para acessar seus ambientes seguros
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full gap-2.5" size="lg" onClick={login}>
            <GithubIcon className="size-5" />
            Continuar com GitHub
          </Button>

          <div className="flex items-start gap-2 rounded-md border border-border/50 bg-muted/50 p-3">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Acesso restrito a membros da organização{" "}
              <span className="font-semibold text-foreground">Camino</span> no
              GitHub.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
