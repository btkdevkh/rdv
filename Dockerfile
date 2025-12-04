# Base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

ARG NEXT_PUBLIC_MASTER_KEY
ENV NEXT_PUBLIC_MASTER_KEY=$NEXT_PUBLIC_MASTER_KEY

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# IMPORTANT : generate Prisma Client in builder image
RUN npx prisma generate

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ARG NEXT_PUBLIC_MASTER_KEY
ENV NEXT_PUBLIC_MASTER_KEY=$NEXT_PUBLIC_MASTER_KEY
ENV NODE_ENV=production

# node_modules has already prisma client generated
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]