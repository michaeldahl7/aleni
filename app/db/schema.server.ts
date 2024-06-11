import {
  index,
  pgTableCreator,
  timestamp,
  varchar,
  integer,
  decimal,
  text,
  PgArray,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";

function formatDate(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based in JavaScript
  const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
  return `${day}/${month}/${year}`;
}

export const createTable = pgTableCreator((name) => `aleni_${name}`);

export const users = createTable(
  "users",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    email: varchar("email", { length: 256 }).notNull(),
    username: varchar("username", { length: 18 }).unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at"),
  },
  (example) => ({
    emailIndex: index("email_idx").on(example.email),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  workouts: many(workouts),
}));

export const workouts = createTable(
  "workout",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    date: timestamp("date").notNull(),
    // array: text("array").array(),
    title: varchar("title", { length: 256 })
      .notNull()
      .$defaultFn(() => {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        return `${formattedDate} Workout`;
      }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (workout) => ({
    userIdIndex: index("user_id_idx").on(workout.userId),
  })
);

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  owner: one(users, {
    fields: [workouts.userId],
    references: [users.id],
  }),
  activities: many(activities),
}));

export const activities = createTable(
  "activity",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    workoutId: text("workout_id")
      .notNull()
      .references(() => workouts.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    name: varchar("name", { length: 256 }).notNull(),
    order: integer("order").notNull(),
  },
  (activity) => ({
    workoutIdIndex: index("workout_id_idx").on(activity.workoutId),
  })
);

export const activitiesRelations = relations(activities, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [activities.workoutId],
    references: [workouts.id],
  }),
  sets: many(sets),
}));

export const sets = createTable("set", {
  id: text("id").primaryKey().$defaultFn(createId),
  activityId: text("activity_id")
    .notNull()
    .references(() => activities.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  reps: integer("reps").notNull(),
  duration: integer("duration"),
  weight: decimal("weight", { precision: 10, scale: 2 }),
  order: integer("order").notNull(),
});

export const setsRelations = relations(sets, ({ one }) => ({
  activity: one(activities, {
    fields: [sets.activityId],
    references: [activities.id],
  }),
}));

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
