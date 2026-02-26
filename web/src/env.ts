import { z } from "zod";

const required = {
  string: (key: string) => z.string().min(1, `${key} é obrigatório`),
  url: (key: string) =>
    z.url(`${key} deve ser uma URL válida`).min(1, `${key} é obrigatório`),
};

export const envSchema = z.object({
  // App
  VITE_NODE_ENV: z.enum(["development", "production"]).default("production"),

  // Server
  VITE_API_URL: required.url("VITE_API_URL"),

  // GitHub OAuth
  VITE_GITHUB_CLIENT_ID: required.string("VITE_GITHUB_CLIENT_ID"),
});

export const env = envSchema.parse(import.meta.env);
