import type { User } from "@/shared/types";

export const mockCurrentUser: User = {
  id: "usr_01",
  name: "Lucas Mazia",
  email: "lucas@envvault.dev",
  avatarUrl: "https://avatars.githubusercontent.com/u/50751236?v=4",
  githubUsername: "limazia",
  hasVaultPassword: false,
};

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: "usr_02",
    name: "Ana Silva",
    email: "ana@envvault.dev",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=ana",
    githubUsername: "anasilva",
    hasVaultPassword: true,
  },
  {
    id: "usr_03",
    name: "Carlos Mendes",
    email: "carlos@envvault.dev",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=carlos",
    githubUsername: "carlosmendes",
    hasVaultPassword: false,
  },
];
