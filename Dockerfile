FROM oven/bun:latest AS base

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN bunx --bun prisma generate

FROM oven/bun:slim AS runner

WORKDIR /app

COPY --from=base /app ./

EXPOSE 3000

CMD ["sh", "-c", "if [ -d prisma/migrations ] && [ \"$(ls -A prisma/migrations 2>/dev/null)\" ]; then bunx --bun prisma migrate deploy; else bunx --bun prisma db push; fi && bun prisma/seed.ts && bun next build && bun next start -p 3000"]
