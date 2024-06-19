import { defineConfig } from "drizzle-kit";

import dotenv from "dotenv";

// Load the appropriate .env file based on NODE_ENV
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

let db_url =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_DATABASE_URL
    : process.env.DATABASE_URL;

export default defineConfig({
  dialect: "postgresql", // Setting the dialect to "sqlite"
  schema: "./app/db/schema.server.ts",
  out: "./drizzle",
  verbose: true,
  dbCredentials: {
    url: db_url || "",
  },
  tablesFilter: ["aleni_*"],
});
