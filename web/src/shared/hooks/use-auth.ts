import { createContext, useContext } from "react";

import type { User } from "@/shared/types";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  hasVaultPassword: boolean;
  isLoading: boolean;
  login: () => void;
  authenticateWithGithub: (code: string) => Promise<void>;
  logout: () => void;
  setVaultPassword: (password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
