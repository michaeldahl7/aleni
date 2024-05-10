import { sql } from "drizzle-orm";
// import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

import { integer, text, sqliteTableCreator } from "drizzle-orm/sqlite-core";
const createTable = sqliteTableCreator((name) => `member_${name}`);

export const users = createTable("users", {
  id: integer("id").primaryKey().notNull(), // Primary key with auto increment
  email: text("email").notNull().unique(), // Non-null and unique email
  createdAt: text("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`), // Using text to store datetime
  updatedAt: text("updatedAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
