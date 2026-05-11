import { Outlet, Navigate } from "react-router-dom";

import { useAuth } from "@/shared/hooks/use-auth";

export function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.08),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.15),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.06),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.1),transparent_50%)]" />
      <Outlet />
    </div>
  );
}
