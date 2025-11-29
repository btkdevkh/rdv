# Step 1 : build
FROM node:22-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_MASTER_KEY
ENV NEXT_PUBLIC_MASTER_KEY=${NEXT_PUBLIC_MASTER_KEY}

# Copy package.json et install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .
RUN npm run build

# Step 2 : production
FROM node:22-alpine
WORKDIR /app

ARG NEXT_PUBLIC_MASTER_KEY
ENV NEXT_PUBLIC_MASTER_KEY=${NEXT_PUBLIC_MASTER_KEY}

# Copy package.json original
COPY package*.json ./
RUN npm install --omit=dev

# Copy only the result build & node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Copy Prisma schema (IMPORTANT)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]
