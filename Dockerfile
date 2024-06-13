# base node image
FROM node:20-alpine3.20 as base

# set for base and all layer that inherit from it
ENV NODE_ENV production
# # Install pnpm globally in the base image
RUN npm install -g pnpm

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /app

ADD package.json pnpm-lock.yaml ./
RUN pnpm install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json pnpm-lock.yaml ./
RUN pnpm prune --omit=dev

# Build the app
FROM base as build

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

ADD . .
RUN pnpm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /app

# You only need these for production
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json

CMD [ "pnpm", "exec", "remix", "serve", "./build/server/index.js" ]