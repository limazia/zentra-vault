import { z } from "zod";

export const createFolderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "O nome da pasta é obrigatório")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .trim()
    .max(255, "A descrição deve ter no máximo 255 caracteres")
    .optional()
    .default(""),
});

export type CreateFolderFormData = z.infer<typeof createFolderSchema>;
