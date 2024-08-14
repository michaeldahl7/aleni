# Aleni

This is a workout tracker app built with Remix, Tailwind, and Drizzle, a PostgreSQL database, deployed via Dockerfile to a my Coolify Server.

## Features

- Authentication with Discord and Google
- Create and manage workouts
- Track progress and set goals
- View workouts and their activities
- View workouts and their sets
- View workouts and their comments

## Accessing the App via the web

You can access the app at https://aleni.app/

## Local Development Setup

To get started, you'll need to create a new Discord application, Google OAuth Credentials, a PostgreSQL database, and Posthog account.

### Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.
2. Set the redirect URL to `http://localhost:3000/auth/discord/callback`.
3. Copy the Client ID and Client Secret.

### Google OAuth Credentials

1. Go to https://developers.google.com/identity/protocols/oauth2/web-server#creatingcred and create a new OAuth client ID.
2. Set the redirect URI to `http://localhost:3000/auth/google/callback`.
3. Copy the Client ID and Client Secret.

### Posthog Account

1. Go to https://app.posthog.com/account/api-keys and create a new API key.
2. Copy the API key.
3. Add the API key and POSTHOG_HOST to the `.env` file.

### Database Setup

Create a new PostgreSQL database and add the following environment variables:

```
DATABASE_URL=""
PROD_DATABASE_URL=""
```

### 2. Setup dependencies

```bash
# Install dependencies
pnpm i


# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Drizzle schema to the database
pnpm db:push
```


### Running the App

Run the following command to start the development server:

```
pnpm run dev
```

Open http://localhost:5173 in your browser to access the app.

## Deployment

You can deploy the app via the Dockerfile or any other hosting provider that supports Node.js and Remix.