import { z } from "zod";

export const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .max(128, "A senha deve ter no máximo 128 caracteres"),
    confirmPassword: z.string(),
    hint: z
      .string()
      .max(200, "A dica deve ter no máximo 200 caracteres")
      .optional()
      .default(""),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type SetPasswordFormData = z.infer<typeof setPasswordSchema>;
