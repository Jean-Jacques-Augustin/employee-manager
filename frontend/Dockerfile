# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN npm ci --no-audit

FROM base AS dev
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules


EXPOSE 3000

# Command to run the development server
CMD ["npm", "run", "dev"]