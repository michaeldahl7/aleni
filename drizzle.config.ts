import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite", // Setting the dialect to "sqlite"
  schema: "./app/db/schema.server.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DB_PATH || "file:./sqlite.db", // Path to the SQLite database file
  },
  tablesFilter: ["member_*"],
});
