import type { VaultFile, FileHistory } from "@/shared/types";

export const mockVaultFiles: VaultFile[] = [
  {
    id: "env_01",
    folderId: "fld_01",
    name: ".env.production",
    content:
      'DATABASE_URL=postgres://prod:secret@db.example.com:5432/app\nREDIS_URL=redis://cache.example.com:6379\nAPI_SECRET=sk_live_a1b2c3d4e5f6\nNODE_ENV=production\nPORT=3000\nJWT_SECRET=jwt_prod_key_2026\nSENTRY_DSN=https://abc123@sentry.io/456',
    size: 245,
    lastModifiedAt: "2026-02-18T14:32:00Z",
    lastEditorName: "Lucas Mazia",
    lastEditorAvatar: "https://avatars.githubusercontent.com/u/50751236?v=4",
    createdAt: "2026-01-10T09:30:00Z",
  },
  {
    id: "env_02",
    folderId: "fld_01",
    name: ".env.production.workers",
    content:
      "WORKER_CONCURRENCY=4\nWORKER_QUEUE=production\nWORKER_REDIS_URL=redis://cache.example.com:6379/1",
    size: 96,
    lastModifiedAt: "2026-02-15T11:00:00Z",
    lastEditorName: "Ana Silva",
    lastEditorAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ana",
    createdAt: "2026-01-12T10:00:00Z",
  },
  {
    id: "env_03",
    folderId: "fld_01",
    name: ".env.production.mailer",
    content:
      "SMTP_HOST=smtp.example.com\nSMTP_PORT=587\nSMTP_USER=noreply@example.com\nSMTP_PASS=mail_secret_123",
    size: 104,
    lastModifiedAt: "2026-02-12T09:00:00Z",
    lastEditorName: "Carlos Mendes",
    lastEditorAvatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=carlos",
    createdAt: "2026-01-14T08:00:00Z",
  },
  {
    id: "env_04",
    folderId: "fld_01",
    name: ".env.production.storage",
    content:
      "AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE\nAWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\nAWS_BUCKET=prod-assets\nAWS_REGION=us-east-1",
    size: 158,
    lastModifiedAt: "2026-02-10T16:30:00Z",
    lastEditorName: "Lucas Mazia",
    lastEditorAvatar: "https://avatars.githubusercontent.com/u/50751236?v=4",
    createdAt: "2026-01-16T12:00:00Z",
  },
  {
    id: "file_cert_01",
    folderId: "fld_01",
    name: "ssl-certificate.pem",
    content:
      "-----BEGIN CERTIFICATE-----\nMIIDXTCCAkWgAwIBAgIJALH9vR+qT2POMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV\nBAYTAkJSMRMwEQYDVQQIDApTYW8gUGF1bG8xITAfBgNVBAoMGEF2YW50UHJvIFZh\ndWx0IFByb2R1Y3Rpb24wHhcNMjYwMTE1MDAwMDAwWhcNMjcwMTE1MDAwMDAwWjBF\nMQswCQYDVQQGEwJCUjETMBEGA1UECAwKU2FvIFBhdWxvMSEwHwYDVQQKDBhBdmFu\ndFBybyBWYXVsdCBQcm9kdWN0aW9uMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB\nCgKCAQEA0Z3VS5JJcds3xfn/ygWep4PAtGoRBh1KMhSJwlLeAt5BKRJ\n-----END CERTIFICATE-----",
    size: 1247,
    lastModifiedAt: "2026-02-16T10:00:00Z",
    lastEditorName: "Lucas Mazia",
    lastEditorAvatar: "https://avatars.githubusercontent.com/u/50751236?v=4",
    createdAt: "2026-01-15T09:00:00Z",
  },
  {
    id: "file_code_01",
    folderId: "fld_01",
    name: "deploy.sh",
    content:
      '#!/bin/bash\nset -euo pipefail\n\necho "Starting deployment..."\n\n# Load environment\nsource .env.production\n\n# Build\nnpm run build\n\n# Deploy to server\nrsync -avz --delete dist/ $DEPLOY_HOST:/var/www/app/\n\necho "Deployment complete!"',
    size: 218,
    lastModifiedAt: "2026-02-14T16:00:00Z",
    lastEditorName: "Carlos Mendes",
    lastEditorAvatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=carlos",
    createdAt: "2026-01-20T11:00:00Z",
  },
  {
    id: "env_05",
    folderId: "fld_02",
    name: ".env.staging",
    content:
      "DATABASE_URL=postgres://staging:pass@staging-db.example.com:5432/app\nREDIS_URL=redis://staging-cache.example.com:6379\nAPI_SECRET=sk_test_x9y8z7w6\nNODE_ENV=staging",
    size: 178,
    lastModifiedAt: "2026-02-17T10:15:00Z",
    lastEditorName: "Ana Silva",
    lastEditorAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ana",
    createdAt: "2026-01-15T12:00:00Z",
  },
  {
    id: "env_06",
    folderId: "fld_02",
    name: ".env.staging.workers",
    content: "WORKER_CONCURRENCY=2\nWORKER_QUEUE=staging",
    size: 44,
    lastModifiedAt: "2026-02-16T15:00:00Z",
    lastEditorName: "Lucas Mazia",
    lastEditorAvatar: "https://avatars.githubusercontent.com/u/50751236?v=4",
    createdAt: "2026-01-18T09:00:00Z",
  },
  {
    id: "env_07",
    folderId: "fld_02",
    name: ".env.staging.mailer",
    content: "SMTP_HOST=smtp.staging.example.com\nSMTP_PORT=587\nSMTP_USER=test@example.com\nSMTP_PASS=staging_mail_pass",
    size: 108,
    lastModifiedAt: "2026-02-14T08:00:00Z",
    lastEditorName: "Carlos Mendes",
    lastEditorAvatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=carlos",
    createdAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "file_code_02",
    folderId: "fld_02",
    name: "seed.ts",
    content:
      'import { db } from "./database";\n\nasync function seed() {\n  console.log("Seeding staging database...");\n\n  await db.user.createMany({\n    data: [\n      { name: "Test User", email: "test@staging.com", role: "admin" },\n      { name: "QA User", email: "qa@staging.com", role: "viewer" },\n    ],\n  });\n\n  console.log("Seed complete!");\n}\n\nseed().catch(console.error);',
    size: 342,
    lastModifiedAt: "2026-02-13T14:00:00Z",
    lastEditorName: "Ana Silva",
    lastEditorAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ana",
    createdAt: "2026-01-25T10:00:00Z",
  },
  {
    id: "env_08",
    folderId: "fld_03",
    name: ".env.local",
    content:
      "DATABASE_URL=postgres://dev:dev@localhost:5432/app_dev\nREDIS_URL=redis://localhost:6379\nAPI_SECRET=dev_secret\nNODE_ENV=development\nDEBUG=true",
    size: 143,
    lastModifiedAt: "2026-02-16T08:45:00Z",
    lastEditorName: "Carlos Mendes",
    lastEditorAvatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=carlos",
    createdAt: "2026-01-20T14:30:00Z",
  },
  {
    id: "env_09",
    folderId: "fld_03",
    name: ".env.development",
    content:
      "DATABASE_URL=postgres://dev:dev@localhost:5432/app_dev\nNODE_ENV=development\nPORT=3001",
    size: 85,
    lastModifiedAt: "2026-02-15T11:00:00Z",
    lastEditorName: "Lucas Mazia",
    lastEditorAvatar: "https://avatars.githubusercontent.com/u/50751236?v=4",
    createdAt: "2026-01-22T09:00:00Z",
  },
  {
    id: "file_cert_02",
    folderId: "fld_03",
    name: "localhost.key",
    content:
      "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA0Z3VS5JJcds3xfn/ygWep4PAtGoRBh1KMhSJwlLeAt5BKRJ\njG2tX3Q1q3mZ5O4ZFk/ZmVVH6Ws3b9A7GJfK3J\n-----END RSA PRIVATE KEY-----",
    size: 892,
    lastModifiedAt: "2026-02-10T12:00:00Z",
    lastEditorName: "Lucas Mazia",
    lastEditorAvatar: "https://avatars.githubusercontent.com/u/50751236?v=4",
    createdAt: "2026-01-22T09:00:00Z",
  },
  {
    id: "file_config_01",
    folderId: "fld_03",
    name: "docker-compose.yml",
    content:
      'version: "3.8"\n\nservices:\n  app:\n    build: .\n    ports:\n      - "3001:3001"\n    env_file:\n      - .env.local\n    depends_on:\n      - db\n      - redis\n\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_USER: dev\n      POSTGRES_PASSWORD: dev\n      POSTGRES_DB: app_dev\n    ports:\n      - "5432:5432"\n\n  redis:\n    image: redis:7-alpine\n    ports:\n      - "6379:6379"',
    size: 412,
    lastModifiedAt: "2026-02-11T09:30:00Z",
    lastEditorName: "Carlos Mendes",
    lastEditorAvatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=carlos",
    createdAt: "2026-01-20T14:30:00Z",
  },
];

export const mockFileHistory: FileHistory[] = [
  {
    id: "hist_01",
    fileId: "env_01",
    author: "Lucas Mazia",
    authorAvatar: "https://avatars.githubusercontent.com/u/50751236?v=4",
    editedAt: "2026-02-18T14:32:00Z",
  },
  {
    id: "hist_02",
    fileId: "env_01",
    author: "Ana Silva",
    authorAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ana",
    editedAt: "2026-02-15T11:20:00Z",
  },
  {
    id: "hist_03",
    fileId: "env_01",
    author: "Carlos Mendes",
    authorAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=carlos",
    editedAt: "2026-02-10T09:00:00Z",
  },
  {
    id: "hist_04",
    fileId: "env_01",
    author: "Lucas Mazia",
    authorAvatar: "https://avatars.githubusercontent.com/u/50751236?v=4",
    editedAt: "2026-01-10T09:30:00Z",
  },
  {
    id: "hist_05",
    fileId: "env_05",
    author: "Ana Silva",
    authorAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ana",
    editedAt: "2026-02-17T10:15:00Z",
  },
  {
    id: "hist_06",
    fileId: "env_05",
    author: "Lucas Mazia",
    authorAvatar: "https://avatars.githubusercontent.com/u/50751236?v=4",
    editedAt: "2026-01-15T12:00:00Z",
  },
];
