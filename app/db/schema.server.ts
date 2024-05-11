// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  integer,
  decimal,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `member_${name}`);

export const users = createTable(
  "user",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 256 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (example) => ({
    nameIndex: index("email_idx").on(example.email),
  })
);

export const workouts = createTable("workout", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  date: timestamp("date").notNull(),
  title: varchar("title", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const exercises = createTable("exercise", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id")
    .notNull()
    .references(() => workouts.id),
  name: varchar("name", { length: 256 }).notNull(),
  //   type: varchar("type", { length: 50 }).notNull(),
  order: integer("order").notNull(),
});

export const sets = createTable("set", {
  id: serial("id").primaryKey(),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercises.id),
  reps: integer("reps"),
  duration: integer("duration"),
  weight: decimal("weight", { precision: 10, scale: 2 }),
  order: integer("order").notNull(),
});
