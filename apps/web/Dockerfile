# check=skip=SecretsUsedInArgOrEnv
# Build from the repository root: docker build -f apps/web/Dockerfile .
FROM oven/bun:1.3-slim AS build
WORKDIR /app
# Every workspace member's package.json must be present or the frozen
# install fails — update this list when adding workspace packages.
COPY package.json bun.lock ./
COPY apps/web/package.json apps/web/package.json
COPY apps/edge/package.json apps/edge/package.json
COPY packages/api-client/package.json packages/api-client/package.json
RUN bun install --frozen-lockfile
COPY packages/api-client packages/api-client
COPY apps/web apps/web
# Bundled into the client at build time.
ARG VITE_RECAPTCHA_SITE_KEY
ARG VITE_POSTHOG_KEY
ARG VITE_POSTHOG_HOST
ARG VITE_APP_VERSION
ENV VITE_RECAPTCHA_SITE_KEY=${VITE_RECAPTCHA_SITE_KEY} \
    VITE_POSTHOG_KEY=${VITE_POSTHOG_KEY} \
    VITE_POSTHOG_HOST=${VITE_POSTHOG_HOST} \
    VITE_APP_VERSION=${VITE_APP_VERSION}
RUN cd apps/web && bun run build

FROM node:22-slim
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
WORKDIR /app
COPY --from=build /app/apps/web/.output ./.output
EXPOSE 3000
USER node
CMD ["node", ".output/server/index.mjs"]
