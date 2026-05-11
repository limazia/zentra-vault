import { api } from "@/shared/lib/axios";

interface AuthUserResponse {
  id: string;
  name: string;
  avatarUrl: string | null;
  githubUsername: string;
  hasVaultPassword: boolean;
}

export interface AuthResultResponse {
  accessToken: string;
  user: AuthUserResponse;
}

export async function exchangeGithubCode(
  code: string,
): Promise<AuthResultResponse> {
  const { data } = await api.get<AuthResultResponse>(
    "/auth/github/callback",
    { params: { code } },
  );

  return data;
}
