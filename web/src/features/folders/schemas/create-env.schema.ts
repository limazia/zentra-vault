import { z } from "zod";

export const createFileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "O nome do arquivo é obrigatório")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
});

export type CreateFileFormData = z.infer<typeof createFileSchema>;
