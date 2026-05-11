# Component Guidelines

Guia de arquitetura, padrões e boas práticas para componentes neste template de microfrontend.

---

## 1. Estrutura de Pastas

```
src/
├── app/                          # Composição da aplicação
│   ├── index.tsx                 # Componente App (entry)
│   ├── not-found.tsx             # Página 404
│   ├── layouts/                  # Layouts raiz
│   │   └── app.layout.tsx        # Layout principal com validação de params
│   ├── providers/                # Composição de providers
│   │   ├── index.tsx             # Provider tree
│   │   └── wrappers/            # Wrappers individuais de providers
│   └── router/                   # Definição de rotas
│       └── index.tsx
├── features/                     # Features isoladas por domínio
│   └── {feature-name}/
│       ├── {feature-name}.page.tsx
│       └── components/           # Componentes específicos da feature
├── shared/                       # Código compartilhado
│   ├── components/
│   │   ├── ui/                   # Componentes base (shadcn/radix)
│   │   └── states/               # Estados reutilizáveis (loading/error/missing)
│   ├── hooks/                    # Custom hooks
│   ├── http/                     # Funções de API
│   ├── lib/                      # Configurações de libs (axios, tanstack-query)
│   ├── schemas/                  # Schemas Zod + tipos TypeScript
│   └── utils/                    # Funções utilitárias
```

### Onde colocar cada coisa

| Tipo | Caminho | Quando usar |
|---|---|---|
| Componente UI base | `src/shared/components/ui/` | Reutilizável em qualquer feature (botão, input, dialog) |
| Estado de app | `src/shared/components/states/` | Estados genéricos (loading, error, missing params) |
| Componente de feature | `src/features/{name}/components/` | Específico de uma feature/domínio |
| Página | `src/features/{name}/{name}.page.tsx` | Entry point de uma rota |
| Layout | `src/app/layouts/` | Wrapper de layout para rotas |
| Hook compartilhado | `src/shared/hooks/` | Lógica reutilizável entre features |
| Schema/tipo | `src/shared/schemas/` | Validação e tipagem de dados |
| Chamada HTTP | `src/shared/http/` | Função de chamada a endpoint |
| Utilitário | `src/shared/utils/` | Funções puras auxiliares |

---

## 2. Convenções de Nomenclatura

### Arquivos

Todos os arquivos usam **kebab-case**:

```
button.tsx
use-item.ts
item.schema.ts
get-item.ts
app.layout.tsx
main.page.tsx
missing-params-state.tsx
```

### Sufixos por tipo

| Tipo | Sufixo | Exemplo |
|---|---|---|
| Página | `.page.tsx` | `main.page.tsx` |
| Layout | `.layout.tsx` | `app.layout.tsx` |
| Schema | `.schema.ts` | `item.schema.ts` |
| Hook | `use-*.ts` | `use-item.ts` |
| Componente UI | `.tsx` | `button.tsx` |
| Componente de estado | `-state.tsx` | `missing-params-state.tsx` |
| HTTP | `get-*.ts`, `create-*.ts` | `get-item.ts` |

### Código

| Tipo | Padrão | Exemplo |
|---|---|---|
| Componente | `PascalCase` | `CheckoutForm` |
| Variável / função | `camelCase` | `handleSubmit`, `itemData` |
| Tipo / Interface | `PascalCase` | `Item`, `GetItemParams` |
| Constante | `camelCase` ou `UPPER_SNAKE` | `defaultConfig`, `MAX_RETRIES` |
| Enum Zod | `camelCase` values | `z.enum(["active", "inactive"])` |

---

## 3. Padrões de Componentes

### Componente básico

```tsx
interface ItemCardProps {
  title: string;
  description: string;
  onSelect: (id: string) => void;
}

export function ItemCard({ title, description, onSelect }: ItemCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
```

### Regras obrigatórias

- **Sempre** tipar props com interface ou type
- **Sempre** tipar parâmetros de funções e retornos quando não triviais
- Usar `import type` para importações que são apenas tipos
- Preferir named exports (`export function`) ao invés de default exports

### Componente com variantes (cva)

Use `cva` para componentes com múltiplas variantes visuais:

```tsx
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
```

---

## 4. Custom Hooks

### Regras

- Nome sempre começa com `use`
- Arquivo em kebab-case: `use-{nome}.ts`
- Tipar o retorno quando não trivial
- Encapsular lógica de TanStack Query em hooks

### Hook com TanStack Query

```ts
import { useQuery } from "@tanstack/react-query";

import type { Item } from "@/shared/schemas";

import { getItem } from "@/shared/http/get-item";

interface UseItemParams {
  itemId: string | null;
  extension: string;
}

interface UseItemReturn {
  item: Item | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function useItem({ itemId, extension }: UseItemParams): UseItemReturn {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["item", itemId, extension],
    queryFn: () => getItem({ itemId: itemId!, extension }),
    enabled: !!itemId,
  });

  return {
    item: data,
    isLoading,
    isError,
  };
}
```

---

## 5. Validação de Inputs

Todo input externo (props opcionais, query params, payloads de eventos, respostas de API) deve ser validado antes de ser usado.

### Query params no layout

```tsx
import { useSearchParams, Outlet } from "react-router-dom";

import { MissingParamsState } from "@/shared/components/states/missing-params-state";

export function AppLayout() {
  const [searchParams] = useSearchParams();

  const source = searchParams.get("source");
  const extension = searchParams.get("extension");

  if (!source || !extension) {
    return <MissingParamsState />;
  }

  return <Outlet />;
}
```

### Props opcionais

```tsx
interface UserProfileProps {
  userId?: string;
  onUpdate?: (data: UserData) => void;
}

export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  if (!userId) {
    return <MissingParamsState />;
  }

  // userId é garantidamente string a partir daqui
  return <ProfileContent userId={userId} onUpdate={onUpdate} />;
}
```

### Validação com Zod para dados externos

```ts
import { z } from "zod";

const apiResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  items: z.array(z.object({
    sku: z.string(),
    quantity: z.number().positive(),
  })),
});

export type ApiResponse = z.infer<typeof apiResponseSchema>;

export function parseApiResponse(data: unknown): ApiResponse {
  return apiResponseSchema.parse(data);
}
```

---

## 6. Schemas e Tipos

### Regras

- Schemas vivem em `src/shared/schemas/`
- Usar Zod para definir o schema e exportar o tipo via `z.infer`
- Arquivo com sufixo `.schema.ts`
- Centralizar exports em `src/shared/schemas/index.ts`

### Estrutura de um schema

```ts
// src/shared/schemas/order.schema.ts
import { z } from "zod";

export const orderSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "confirmed", "shipped", "delivered"]),
  total: z.number().positive(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })),
  createdAt: z.string().datetime(),
});

export type Order = z.infer<typeof orderSchema>;
```

### Re-export no index

```ts
// src/shared/schemas/index.ts
export { orderSchema, type Order } from "./order.schema";
export { itemSchema, type Item } from "./item.schema";
```

---

## 7. Estilização

### Tailwind + cn()

Use classes utilitárias do Tailwind e `cn()` para merge condicional:

```tsx
import { cn } from "@/shared/utils/cn";

interface CardProps {
  isActive: boolean;
  className?: string;
}

export function Card({ isActive, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-colors",
        isActive && "border-primary bg-primary/5",
        className
      )}
    />
  );
}
```

### Regras

- Usar classes Tailwind ao invés de CSS customizado
- Usar `cn()` (clsx + tailwind-merge) para combinar classes condicionais
- Usar `cva` quando o componente tem variantes estruturadas
- Aceitar `className` como prop para permitir customização externa
- Usar variáveis CSS do tema (definidas em `src/styles/globals.css`) para cores

---

## 8. Ordem de Imports

Seguir esta ordem em todos os arquivos:

```tsx
// 1. Pacotes externos
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// 2. Tipos (import type)
import type { Item } from "@/shared/schemas";

// 3. Aliases internos (@/)
import { Button } from "@/shared/components/ui/button";
import { useItem } from "@/shared/hooks/use-item";
import { cn } from "@/shared/utils/cn";

// 4. Imports relativos
import { FeatureCard } from "./components/feature-card";
```

### Regras

- Separar cada grupo com uma linha em branco
- Usar `import type` para importações que são apenas tipos
- Preferir `@/` ao invés de caminhos relativos longos (`../../../`)
- Não misturar imports de tipo com imports de valor no mesmo statement

---

## 9. Componentes de Estado

O template inclui componentes prontos para estados comuns em `src/shared/components/states/`:

| Componente | Uso |
|---|---|
| `MissingParamsState` | Query params obrigatórios ausentes |
| `SessionErrorState` | Erro de autenticação/sessão |
| `SessionLoadingState` | Loading durante inicialização |

### Quando criar novos componentes de estado

- O estado é reutilizável entre features
- O estado tem UI específica (ícone, mensagem, ação)
- Coloque em `src/shared/components/states/`
- Use o sufixo `-state.tsx`

---

## 10. Checklist de Novo Componente

Antes de criar um componente, verifique:

1. [ ] Já existe um componente similar em `src/shared/components/ui/`?
2. [ ] O componente é específico de uma feature ou reutilizável?
3. [ ] Props estão tipadas com interface/type?
4. [ ] Inputs externos têm validação/guard clause?
5. [ ] Arquivo segue kebab-case?
6. [ ] Componente segue PascalCase?
7. [ ] `import type` usado para importações de tipo?
8. [ ] Ordem de imports seguida?
9. [ ] `cn()` usado para classes condicionais?
10. [ ] Tracking PostHog adicionado para interações relevantes?
