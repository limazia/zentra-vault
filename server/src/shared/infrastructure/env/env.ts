import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_ORG: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string().default('24h'),
  FRONTEND_URL: z.url().default('http://localhost:5173'),
  PORT: z.coerce.number().default(3000),
  KMS_PROVIDER: z.enum(['aws', 'local']).default('local'),
  AWS_KMS_KEY_ARN: z.string().optional(),
  AWS_REGION: z.string().optional(),
  LOCAL_KEK_HEX: z.string().length(64).optional(),
})

export type Env = z.infer<typeof envSchema>
