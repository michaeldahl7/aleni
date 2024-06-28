import { db } from "~/db/config.server";
import { eq } from "drizzle-orm"; // Ensure db is properly initialized
import { workouts } from "~/db/schema.server";
import type { NewWorkout, Activity } from "~/db/schema.server";

export async function getWorkouts(userId: string) {
  return db.query.workouts.findMany({
    columns: { title: true, id: true, date: true },
    where: eq(workouts.userId, userId),
  });
}

1;
2
export async function getWorkout(workoutId: string) {
  return db.query.workouts.findFirst({
    columns: { title: true, id: true, date: true, activities: true },
    where: eq(workouts.id, workoutId),
  });
}

export async function deleteWorkout(workoutId: string) {
  return await db.delete(workouts).where(eq(workouts.id, workoutId));
}

export const createWorkout = async (
  workout: NewWorkout
): Promise<{ workoutId: string }[]> => {
  try {
    return await db
      .insert(workouts)
      .values({
        ...workout,
        date: new Date(),
        activities: workout.activities as Activity[],
      })
      .returning({ workoutId: workouts.id });
  } catch (error) {
    console.log(error);
    return [];
  }
};
