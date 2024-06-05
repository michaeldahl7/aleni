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
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const createTable = pgTableCreator((name) => `member_${name}`);

export const users = createTable(
  "user",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 256 }).notNull(),
    username: varchar("username", { length: 18 }).unique(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at"),
  },
  (example) => ({
    emailIndex: index("email_idx").on(example.email),
  })
);

export const workouts = createTable(
  "workout",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: timestamp("date").notNull(),
    title: varchar("title", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (workout) => ({
    userIdIndex: index("user_id_idx").on(workout.userId),
  })
);

export const activities = createTable(
  "activity",
  {
    id: serial("id").primaryKey(),
    workoutId: integer("workout_id")
      .notNull()
      .references(() => workouts.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 256 }).notNull(),
    order: integer("order").notNull(),
  },
  (activity) => ({
    workoutIdIndex: index("workout_id_idx").on(activity.workoutId),
  })
);

export const sets = createTable("set", {
  id: serial("id").primaryKey(),
  activityId: integer("activity_id")
    .notNull()
    .references(() => activities.id, { onDelete: "cascade" }),
  reps: integer("reps").notNull(),
  duration: integer("duration"),
  weight: decimal("weight", { precision: 10, scale: 2 }),
  order: integer("order").notNull(),
});

export const insertUsersSchema = createInsertSchema(users);
export const selectUsersSchema = createSelectSchema(users);
export type UserInsert = z.infer<typeof insertUsersSchema>;
export type UserSelect = z.infer<typeof selectUsersSchema>;

export const insertWorkoutsSchema = createInsertSchema(workouts);
export const selectWorkoutsSchema = createSelectSchema(workouts);
export type WorkoutInsert = z.infer<typeof insertWorkoutsSchema>;
export type WorkoutSelect = z.infer<typeof selectWorkoutsSchema>;

export const insertActivitiesSchema = createInsertSchema(activities);
export const selectActivitiesSchema = createSelectSchema(activities);
export type ActivityInsert = z.infer<typeof insertActivitiesSchema>;
export type ActivitySelect = z.infer<typeof selectActivitiesSchema>;

export const insertSetsSchema = createInsertSchema(sets);
export const selectSetsSchema = createSelectSchema(sets);
export type SetInsert = z.infer<typeof insertSetsSchema>;
export type SetSelect = z.infer<typeof selectSetsSchema>;

export const validationSetSchema = insertSetsSchema.extend({
  reps: z.number({ required_error: "Please provide a number of reps" }).min(1),
  weight: z.string().optional(),
});

export const validationActivitySchema = insertActivitiesSchema.extend({
  name: z.string({ required_error: "Please provide a name" }).min(1),
  sets: z
    .array(validationSetSchema)
    .nonempty({ message: "Please provide at least one set" }),
});

export const validationWorkoutSchema = insertWorkoutsSchema.extend({
  title: z.string({ required_error: "Please provide a workout title" }),
  activities: z
    .array(validationActivitySchema)
    .nonempty({ message: "Please provide at least one activity" }),
});

export type workoutValidation = z.infer<typeof validationWorkoutSchema>;
