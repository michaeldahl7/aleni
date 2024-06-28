# base node image
FROM node:20-alpine as base

# Set for base and all layers that inherit from it
ENV NODE_ENV production
RUN apk add --no-cache python3 make g++ curl
# Install pnpm globally in the base image
RUN npm install -g pnpm

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY  package.json pnpm-lock.yaml ./
RUN pnpm prune --production

# Build the app
FROM base as build

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

COPY drizzle.config.ts /app/drizzle.config.ts

RUN ls -la /app

COPY . .

RUN pnpm run db:gen

RUN pnpm run build

# Finally, build the production image with minimal footprint
FROM base

ENV NODE_ENV production

WORKDIR /app

# You only need these for production
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json
COPY . .

# # Add drizzle config and migrations
COPY --from=build /app/drizzle.config.ts /app/drizzle.config.ts
COPY --from=build /app/drizzle /app/drizzle

CMD [ "pnpm", "run", "start" ]
