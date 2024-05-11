import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // Setting the dialect to "sqlite"
  schema: "./app/db/schema.server.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.POSTGRES_URL || "", // Path to the SQLite database file
  },
  tablesFilter: ["member_*"],
});
