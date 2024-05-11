import * as schema from "~/db/schema.server";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql, { schema });
