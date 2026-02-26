import { z } from "zod";

export const secretKeySchema = z.object({
  key: z
    .string()
    .trim()
    .min(1, "A chave de acesso é obrigatória"),
});

export type SecretKeyFormData = z.infer<typeof secretKeySchema>;
