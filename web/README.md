# Zentra Vault

Frontend do Avantpro Vault — gerenciador seguro de variáveis de ambiente, arquivos e credenciais para equipes. Construído com React, TypeScript, Vite, TanStack Query, Tailwind v4 e shadcn/ui.

## Configuração Inicial

### 1) Variáveis de ambiente

Crie um arquivo `.env` na raiz usando `.env.exemple` como base:

```bash
cp .env.exemple .env
```

Configure:

```env
# App
VITE_NODE_ENV="development"

# Server
VITE_API_URL="http://localhost:3000"
```

O schema de validação está em `src/env.ts` e usa Zod para garantir que todas as variáveis obrigatórias estejam presentes na inicialização.

### 2) Instalação

```bash
yarn install
```

### 3) Executar o projeto

```bash
yarn dev
```

## Estrutura do projeto

```text
src/
  app/
    layouts/                  # Layouts (auth, dashboard)
    providers/                # Composição de providers
      wrappers/               # Wrappers individuais (Query, Theme, Auth, etc.)
    router/                   # Rotas da aplicação
  features/
    auth/                     # Login e autenticação
    dashboard/                # Página principal / overview
    folders/                  # Gerenciamento de pastas e arquivos
    env/                      # Editor de variáveis de ambiente
    audit/                    # Logs de auditoria
    settings/                 # Configurações do usuário/sistema
  shared/
    components/
      header/                 # Header e navegação
      states/                 # Estados de UI (erro/loading/params)
      ui/                     # Componentes base (shadcn/radix)
    hooks/                    # Hooks compartilhados
    http/                     # Chamadas HTTP
    lib/                      # Clients/configs (axios, query client)
    mocks/                    # Dados mock para desenvolvimento
    schemas/                  # Schemas Zod + tipos
    stores/                   # Stores globais (zustand)
    types/                    # Tipos compartilhados
    utils/                    # Helpers utilitários
  assets/
    logos/                    # Logos SVG
    icons/                    # Ícones customizados
  styles/
    globals.css               # Estilos globais e tokens do tema
```

## Rotas

| Rota                              | Página           | Auth | Vault |
| --------------------------------- | ---------------- | ---- | ----- |
| `/login`                          | Login            | —    | —     |
| `/dashboard`                      | Dashboard        | Sim  | Sim   |
| `/folders`                        | Listagem         | Sim  | Sim   |
| `/folders/:folderId`              | Detalhe da pasta | Sim  | Sim   |
| `/folders/:folderId/file/:fileId` | Editor de env    | Sim  | Sim   |
| `/audit`                          | Auditoria        | Sim  | Sim   |
| `/settings`                       | Configurações    | Sim  | —     |

## Fluxo de dados

1. `src/main.tsx` monta `App` no elemento `#avantpro-vault-root`
2. `src/app/index.tsx` aplica `AppProviders` e `AppRoutes`
3. `ProtectedRoute` valida autenticação; `VaultRequiredRoute` valida acesso ao vault
4. Features usam `shared/*` para UI, hooks, schemas, tipos e HTTP

## Scripts disponíveis

```bash
yarn dev        # Desenvolvimento
yarn build      # Build de produção
yarn preview    # Preview do build
yarn lint       # ESLint
yarn release    # Semantic release
```

> Este projeto usa versionamento e changelog automáticos com **Semantic Release**.

## Licença

MIT
