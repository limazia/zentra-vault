# ===========================================
# Build stage
# ===========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar dependências do sistema necessárias para build (sharp, bcrypt, etc)
RUN apk add --no-cache python3 make g++

# Copiar arquivos de dependências primeiro (melhor cache de layers)
COPY package.json yarn.lock ./

# Instalar todas as dependências (incluindo devDependencies para build)
RUN yarn install --frozen-lockfile

# Copiar código fonte
COPY tsconfig.json ./
COPY drizzle.config.ts ./
COPY src ./src

# Build da aplicação
RUN yarn build

# ===========================================
# Production dependencies stage
# ===========================================
FROM node:22-alpine AS deps

WORKDIR /app

# Instalar dependências do sistema necessárias para deps nativas (sharp)
RUN apk add --no-cache python3 make g++

# Copiar arquivos de dependências
COPY package.json yarn.lock ./

# Instalar apenas dependências de produção
RUN yarn install --frozen-lockfile --production && \
    yarn cache clean

# ===========================================
# Production stage
# ===========================================
FROM node:22-alpine AS production

WORKDIR /app

# Instalar apenas curl para healthcheck
RUN apk add --no-cache curl

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S scrapo -u 1001 -G nodejs

# Copiar dependências de produção
COPY --from=deps /app/node_modules ./node_modules

# Copiar build da aplicação
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Copiar arquivos necessários para migrations
COPY --from=builder /app/drizzle.config.ts ./
COPY src/infrastructure/database/migrations ./src/infrastructure/database/migrations

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Expor porta
EXPOSE 3000

# Healthcheck embutido
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Mudar para usuário não-root
USER scrapo

# Comando de inicialização (apenas migrations + start, SEM seed)
CMD ["sh", "-c", "yarn db:migrate && node dist/app.js"]
