# Install dependencies only when needed
FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
# --production 表示只安裝「dependencies」的相依套件，而不安裝「devDependencies」的相依套件。這是為了在生產環境中減少安裝的套件數量和檔案大小，從而加快應用程式的啟動時間和運行效率。
# --ignore-scripts 表示在安裝相依套件時不要執行任何相依套件的安裝腳本。這通常是為了在應用程式部署期間加快安裝速度，因為安裝腳本可能會耗時較長，而且可能會出現問題。
# --prefer-offline 表示在安裝相依套件時優先使用本地緩存。如果套件已經存在本地緩存中，則不需要從遠端下載。這可以減少安裝時間和網絡流量，尤其是在網絡連接不穩定的情況下。
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start"]