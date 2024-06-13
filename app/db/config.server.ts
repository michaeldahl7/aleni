import * as schema from "~/db/schema.server";
import { drizzle } from "drizzle-orm/postgres-js";
// import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// const migrationClient = postgres(process.env.DATABASE_URL ?? "", { max: 1 });
// migrate(drizzle(migrationClient), ...)

// for query purposes
const queryClient = postgres(process.env.DATABASE_URL ?? "");

export const db = drizzle(queryClient, { schema });

// Use this object to send drizzle queries to your DB
// export const db = drizzle(sql, { schema });
