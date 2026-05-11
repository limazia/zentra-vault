import { api } from "@/shared/lib/axios";

export async function setVaultPassword(password: string): Promise<void> {
  await api.post("/users/vault-password", { password });
}

export interface VerifyVaultPasswordResponse {
  valid: boolean;
}

export async function verifyVaultPassword(
  password: string,
): Promise<VerifyVaultPasswordResponse> {
  const { data } = await api.post<VerifyVaultPasswordResponse>(
    "/users/vault-password/verify",
    { password },
  );

  return data;
}
