import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";

export function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
            <Shield className="size-8 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="pt-4">
          <Button asChild variant="link" className="gap-2">
            <Link to="/dashboard">
              <ArrowLeft className="size-4" />
              Voltar ao Painel
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
