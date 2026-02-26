import { useState, useCallback, type ReactNode } from "react";

import { env } from "@/env";
import type { User } from "@/shared/types";
import { AuthContext } from "@/shared/hooks/use-auth";
import {
  exchangeGithubCode,
  type AuthResultResponse,
} from "@/shared/http/auth";
import { setVaultPassword as setVaultPasswordApi } from "@/shared/http/vault";

const STORAGE_KEY_USER = "envvault_auth_user";
const STORAGE_KEY_TOKEN = "envvault_auth_token";

function getStoredUser(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_USER);
    if (!stored) return null;
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

function getStoredToken(): string | null {
  return localStorage.getItem(STORAGE_KEY_TOKEN);
}

function persistAuth(token: string, user: User): void {
  localStorage.setItem(STORAGE_KEY_TOKEN, token);
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
}

function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEY_TOKEN);
  localStorage.removeItem(STORAGE_KEY_USER);
}

function mapResponseToUser(response: AuthResultResponse): User {
  return {
    id: response.user.id,
    name: response.user.name,
    avatarUrl: response.user.avatarUrl ?? "",
    githubUsername: response.user.githubUsername,
    hasVaultPassword: response.user.hasVaultPassword,
  };
}

export function AuthProviderWrapper({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(() => {
    const redirectUri = `${window.location.origin}/integrations/github`;

    const url = new URL("https://github.com/login/oauth/authorize");
    url.searchParams.set("client_id", env.VITE_GITHUB_CLIENT_ID);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("scope", "read:org");

    window.location.href = url.toString();
  }, []);

  const authenticateWithGithub = useCallback(async (code: string) => {
    setIsLoading(true);

    try {
      const result = await exchangeGithubCode(code);

      const newUser: User = mapResponseToUser(result);

      persistAuth(result.accessToken, newUser);
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearAuth();
  }, []);

  const setVaultPassword = useCallback(
    async (password: string) => {
      if (!user) return;

      await setVaultPasswordApi(password);

      const updated: User = { ...user, hasVaultPassword: true };
      setUser(updated);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    },
    [user],
  );

  return (
    <AuthContext
      value={{
        user,
        isAuthenticated: !!user && !!getStoredToken(),
        hasVaultPassword: !!user?.hasVaultPassword,
        isLoading,
        login,
        authenticateWithGithub,
        logout,
        setVaultPassword,
      }}
    >
      {children}
    </AuthContext>
  );
}
