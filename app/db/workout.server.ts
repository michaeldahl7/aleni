// import bcrypt from "bcryptjs";
import { db } from "~/db/config.server";
import { eq } from "drizzle-orm"; // Ensure db is properly initialized
import { workouts, sets, activities } from "~/db/schema.server";

export type  Workout = {
  date: Date;
  userId: number;
  id?: number;
  createdAt?: Date | undefined;
  title?: string | null | undefined;
}

export async function createWorkout(userId: number, date: Date, title: string) {
  try {
    const newWorkout: Workout = { userId, date, title};
    const insertedWorkout = await db.insert(workouts).values(newWorkout).returning();
    return insertedWorkout[0];
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}
export async function createActivity(workoutId: number, name: string, order: number) {
  try {
    const newActivity = { workoutId, name, order };
    const insertedActivity = await db.insert(activities).values(newActivity).returning();
    return insertedActivity[0];
  } catch (error) {
    console.error("Error creating activity:", error);
    return null;
  }
}

export async function createSet(activityId: number, reps: number, weight: string, order: number) {
  try {
    console.log("set creation")
    const newSet = { activityId, reps, weight, order };
    console.log("newSet", newSet)
    const insertedSet = await db.insert(sets).values(newSet).returning();
    return insertedSet[0];
  } catch (error) {
    console.error("Error creating set:", error);
    return null;
  }
}
