# # Base node image
# FROM node:20.2.0-alpine3.18 as base

# ENV NODE_ENV production

# # Install pnpm globally in the base image
# RUN npm install -g pnpm

# # Install all node_modules, including dev dependencies
# FROM base as deps

# RUN mkdir /app
# WORKDIR /app

# COPY package.json pnpm-lock.yaml ./
# RUN pnpm install --production=false

# # Setup production node_modules
# FROM base as production-deps

# RUN mkdir /app
# WORKDIR /app

# COPY --from=deps /app/node_modules /app/node_modules
# COPY package.json pnpm-lock.yaml ./
# RUN pnpm prune --production

# # Build the app
# FROM base as build

# RUN mkdir /app
# WORKDIR /app

# COPY --from=deps /app/node_modules /app/node_modules
# COPY . .
# RUN pnpm run build

# # Finally, build the production image with minimal footprint
# FROM base

# ENV NODE_ENV production

# RUN mkdir /app
# WORKDIR /app


# COPY --from=production-deps /app/node_modules ./node_modules
# COPY --from=build /app/build/server ./build/server
# COPY --from=build /app/build/client ./build/client

# # Copy only necessary files for runtime
# COPY package.json ./

# # Create non-root user for security
# RUN addgroup -S remix && adduser -S remix -G remix
# USER remix

# ENTRYPOINT ["node", "node_modules/.bin/remix-serve", "./build/server/index.js"]




FROM node:20.2.0-alpine3.18 as base

ENV NODE_ENV production

RUN npm install -g pnpm

FROM base as deps

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --production=false

FROM deps AS builder

WORKDIR /app
COPY . .
RUN pnpm run build

FROM deps AS prod-deps
WORKDIR /app
RUN pnpm install --production

FROM base as runner

WORKDIR /app

RUN addgroup --system --gid 1001 remix
RUN adduser --system --uid 1001 remix

USER remix

COPY --from=prod-deps --chown=remix:remix /app/pnpm-lock.yaml ./
COPY --from=prod-deps --chown=remix:remix /app/package*.json ./
COPY --from=prod-deps --chown=remix:remix /app/node_modules ./node_modules
COPY --from=builder --chown=remix:remix /app/build/server ./build/server
COPY --from=builder --chown=remix:remix /app/build/client ./build/client

ENTRYPOINT [ "pnpm", "run", "start"]