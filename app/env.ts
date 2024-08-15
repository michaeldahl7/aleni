// env.ts or env.js
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

if (process.env.NODE_ENV !== 'production') {
	const dotenv = await import('dotenv');
	dotenv.config({ path: '.env.development' });
  }

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    HOST_NAME: z.string(),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
		POSTHOG_HOST: z.string(),
		POSTHOG_API_KEY: z.string(),
		DISCORD_CLIENT_ID: z.string(),
		DISCORD_CLIENT_SECRET: z.string(),
		GOOGLE_CLIENT_ID: z.string(),
		GOOGLE_CLIENT_SECRET: z.string(),
		SESSION_SECRET: z.string(),
  },
  runtimeEnv: process.env,
});