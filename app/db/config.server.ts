import * as schema from "~/db/schema.server";
import { drizzle } from "drizzle-orm/postgres-js";

import postgres from "postgres";
import { config } from "dotenv";


config();

const queryClient = postgres(process.env.DATABASE_URL ?? "");

export const db = drizzle(queryClient, { schema });
