import { Navigate } from "react-router-dom";

import { useAuth } from "@/shared/hooks/use-auth";

interface VaultRequiredRouteProps {
  children: React.ReactNode;
}

export function VaultRequiredRoute({ children }: VaultRequiredRouteProps) {
  const { hasVaultPassword } = useAuth();

  if (!hasVaultPassword) {
    return <Navigate to="/settings" replace />;
  }

  return <>{children}</>;
}
