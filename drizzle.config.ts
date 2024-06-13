import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // Setting the dialect to "sqlite"
  schema: "./app/db/schema.server.ts",
  out: "./drizzle",
  verbose: true,
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  tablesFilter: ["aleni_*"],
});
