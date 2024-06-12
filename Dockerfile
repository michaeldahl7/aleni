# Base node image
FROM node:20.2.0-alpine3.18 as base

ENV NODE_ENV production

# Install pnpm globally in the base image
RUN npm install -g pnpm

# Install all node_modules, including dev dependencies
FROM base as deps

RUN mkdir /app
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --production=false

# Setup production node_modules
FROM base as production-deps

RUN mkdir /app
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY package.json pnpm-lock.yaml ./
RUN pnpm prune --production

# Build the app
FROM base as build

RUN mkdir /app
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN pnpm run build

# Finally, build the production image with minimal footprint
FROM base

ENV NODE_ENV production

RUN mkdir /app
WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build/server /app/build/server
COPY --from=build /app/build/client /app/build/client

# Copy only necessary files for runtime
COPY --chown=node:node package.json ./

# Create non-root user for security
RUN addgroup -S remix && adduser -S remix -G remix
USER remix

ENTRYPOINT ["node", "node_modules/.bin/remix-serve", "./build/server/index.js"]
