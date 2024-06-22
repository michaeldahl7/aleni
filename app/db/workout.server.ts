import { db } from "~/db/config.server";
import { eq } from "drizzle-orm"; // Ensure db is properly initialized
import { sets, activities, workouts } from "~/db/schema.server";
import type {
  WorkoutInsert,
  SetInsert,
  ActivityInsert,
} from "~/db/schema.server";

export async function getWorkoutsDetailed(userId: string) {
  return db.query.workouts.findMany({
    columns: { title: true, id: true, date: true },
    where: eq(workouts.userId, userId),
    with: {
      activities: {
        with: {
          sets: true,
        },
      },
    },
  });
}

export async function getWorkouts(userId: string) {
  return db.query.workouts.findMany({
    columns: { title: true, id: true, date: true },
    where: eq(workouts.userId, userId),
  });
}

export type Workout = {
  id: string;
  title: string;
  date: Date | null;
  activities: {
    name: string;
    sets: {
      reps: number | null;
      weight: string | null;
    }[];
  }[];
};

export async function getWorkoutById(workoutId: string) {
  return db.query.workouts.findFirst({
    columns: { title: true, id: true, date: true },
    where: eq(workouts.id, workoutId),
    with: {
      activities: {
        columns: { name: true },
        with: {
          sets: {
            columns: { reps: true, weight: true },
          },
        },
      },
    },
  });
}

export async function deleteWorkout(workoutId: string) {
  return await db.delete(workouts).where(eq(workouts.id, workoutId));
}

export async function createWorkout(
  userId: string,
  activityData: { name: string; sets: { reps: number; weight?: string }[] }[],
  title?: string
) {
  const newWorkout: WorkoutInsert = {
    userId: userId,
    date: new Date(),
    title: title,
  };

  // Start a transaction
  const workout = await db.transaction(async (trx) => {
    // Insert the workout
    const [insertedWorkout] = await trx
      .insert(workouts)
      .values(newWorkout)
      .returning();
    const workoutId = insertedWorkout.id;

    // Insert activities and sets
    for (
      let activityIndex = 0;
      activityIndex < activityData.length;
      activityIndex++
    ) {
      const activity = activityData[activityIndex];
      const newActivity: ActivityInsert = {
        workoutId,
        name: activity.name,
        order: activityIndex,
      };
      const [insertedActivity] = await trx
        .insert(activities)
        .values(newActivity)
        .returning();
      const activityId = insertedActivity.id;

      for (let setIndex = 0; setIndex < activity.sets.length; setIndex++) {
        const set = activity.sets[setIndex];
        const weight = set.weight === "" ? null : set.weight;
        const newSet: SetInsert = {
          activityId,
          reps: set.reps,
          weight: weight,
          order: setIndex,
        };
        await trx.insert(sets).values(newSet).returning();
      }
    }

    return insertedWorkout;
  });
  return workout;
}
