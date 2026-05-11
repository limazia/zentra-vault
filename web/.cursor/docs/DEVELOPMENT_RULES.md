# Development Rules

Regras obrigatórias para todo desenvolvimento e refatoração neste template de microfrontend.

---

## 1. Root Mounting

Cada microfrontend deve ter um root ID único e descritivo. IDs genéricos causam conflito quando múltiplos microfrontends coexistem na mesma página.

### Regras

| Regra | Exemplo correto | Exemplo errado |
|---|---|---|
| ID único por recurso | `checkout-root` | `microfrontend-root` |
| `index.html` e `main.tsx` alinhados | ambos usam `checkout-root` | um usa `root`, outro usa `app` |
| Tratar mismatch como blocker | CI/review deve rejeitar | ignorar diferença |

### Checklist

- [ ] `index.html` contém `<div id="{resource-name}-root"></div>`
- [ ] `src/main.tsx` usa `document.getElementById("{resource-name}-root")`
- [ ] Nenhum outro microfrontend no host usa o mesmo ID

### Exemplo

```html
<!-- index.html -->
<div id="payments-root"></div>
```

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/app";

import "@/styles/globals.css";

createRoot(document.getElementById("payments-root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

## 2. Parameter Validation

Nunca confie em dados opcionais vindos de props, URL/query params, eventos ou payloads de API. Valide antes de usar.

### Regras

- Adicionar guard clauses / early returns antes de consumir valores
- Usar Zod para validação de dados externos ou não confiáveis
- Documentar estados inválidos esperados no fluxo de UI (parâmetros ausentes, erro de sessão, etc.)

### Padrão com Zod

```ts
// src/shared/schemas/example.schema.ts
import { z } from "zod";

export const exampleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  status: z.enum(["active", "inactive"]),
});

export type Example = z.infer<typeof exampleSchema>;
```

### Guard Clause em componentes

```tsx
function ExamplePage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return <MissingParamsState />;
  }

  return <ExampleContent id={id} />;
}
```

### Guard Clause em hooks

```ts
function useItem(itemId: string | null) {
  return useQuery({
    queryKey: ["item", itemId],
    queryFn: () => getItem(itemId!),
    enabled: !!itemId,
  });
}
```

### Estados de UI para entradas inválidas

O template fornece componentes em `src/shared/components/states/` para cenários comuns:

| Componente | Quando usar |
|---|---|
| `MissingParamsState` | Query params obrigatórios ausentes ou inválidos |
| `SessionErrorState` | Falha de autenticação ou sessão expirada |
| `SessionLoadingState` | Carregamento inicial de sessão/contexto |

---

## 3. PostHog Tracking

Rastreie interações relevantes do usuário para analytics. O PostHog já está integrado via provider.

### Regras

- Rastrear interações relevantes com `posthog.capture(...)`
- Naming de eventos: `[resource]_[action]_[context]`
- Adicionar tracking nas páginas/componentes onde a interação acontece
- **Nunca** rastrear dados sensíveis (PII, tokens, payloads sensíveis)

### Naming Convention

```
{recurso}_{ação}_{contexto}

Exemplos:
  payment_created_checkout
  item_viewed_detail
  filter_applied_list
  form_submitted_settings
```

### Exemplo de uso

```tsx
import { usePostHog } from "posthog-js/react";

function CheckoutButton({ orderId }: { orderId: string }) {
  const posthog = usePostHog();

  function handleCheckout() {
    posthog.capture("order_confirmed_checkout", {
      order_id: orderId,
    });
  }

  return <Button onClick={handleCheckout}>Confirmar</Button>;
}
```

### O que NÃO rastrear

- E-mails, nomes, CPF/CNPJ ou qualquer PII
- Tokens de autenticação ou sessão
- Payloads brutos de API com dados sensíveis
- Senhas ou credenciais

---

## 4. Variáveis de Ambiente

Todas as variáveis de ambiente são validadas com Zod em `src/env.ts` no startup da aplicação.

### Variáveis obrigatórias

| Variável | Tipo | Descrição |
|---|---|---|
| `VITE_NODE_ENV` | `"development"` \| `"production"` | Ambiente atual |
| `VITE_API_URL` | `string` (url) | URL base da API |
| `VITE_POSTHOG_KEY` | `string` | Chave do PostHog |
| `VITE_POSTHOG_HOST` | `string` (url) | Host do PostHog |

### Variáveis opcionais

| Variável | Tipo | Descrição |
|---|---|---|
| `VITE_ENABLE_API_DELAY` | `string` | Habilita delay artificial nas chamadas de API (dev) |

### Regras

- Nunca commitar `.env` com valores reais
- Adicionar novas variáveis no schema Zod em `src/env.ts` antes de usá-las
- Usar `env.VITE_*` (importado de `@/env`) ao invés de `import.meta.env` direto

---

## 5. HTTP e API

Chamadas de API seguem um padrão centralizado via Axios com interceptors.

### Regras

- Usar a instância `api` de `src/shared/lib/axios.ts` (nunca `axios` direto)
- Uma função por endpoint em `src/shared/http/`
- Tipar parâmetros e retorno de cada função
- Headers de autenticação (`token`, `email`) são injetados automaticamente via interceptor

### Exemplo

```ts
// src/shared/http/get-item.ts
import type { Item } from "@/shared/schemas";

import { api } from "@/shared/lib/axios";

interface GetItemParams {
  itemId: string;
  extension: string;
}

export async function getItem({ itemId, extension }: GetItemParams): Promise<Item> {
  const { data } = await api.get(`/items/${itemId}`, {
    params: { extension },
  });
  return data;
}
```

---

## 6. Checklist de Novo Recurso

Ao criar um novo microfrontend a partir deste template:

1. **Root ID**: Renomear `microfrontend-root` para `{nome-do-recurso}-root` em `index.html` e `src/main.tsx`
2. **Variáveis de ambiente**: Atualizar `.env` e `src/env.ts` com as variáveis necessárias
3. **Schemas**: Criar schemas Zod para os dados do domínio em `src/shared/schemas/`
4. **HTTP**: Criar funções de API tipadas em `src/shared/http/`
5. **Features**: Criar páginas/componentes do recurso em `src/features/{nome}/`
6. **Rotas**: Registrar rotas em `src/app/router/`
7. **Tracking**: Adicionar eventos PostHog nas interações relevantes
8. **Validação**: Garantir que todos os inputs externos têm guard clauses ou validação Zod
