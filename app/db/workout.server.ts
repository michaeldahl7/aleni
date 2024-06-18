import { db } from "~/db/config.server";
import { eq } from "drizzle-orm"; // Ensure db is properly initialized
import { sets, activities, workouts } from "~/db/schema.server";
import type {
  WorkoutInsert,
  SetInsert,
  ActivityInsert,
  WorkoutSelect,
} from "~/db/schema.server";

// type WorkoutInfo = {
//   title: string;
//   id: string;
// };
export async function getWorkoutsOfUser(userId: string) {
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

// export async function getWorkouts(userId: string): Promise<WorkoutSelect[]> {
//   return await db.query.workouts.findMany({
//     where: eq(workouts.userId, userId),
//   });
// }

// export async function getWorkoutsOfUser(
//   userId: string
// ): Promise<WorkoutInfo[]> {
//   try {
//     const data = await db.query.workouts.findMany({
//       columns: { title: true, id: true },
//       where: eq(workouts.userId, userId),
//     });
//     return data;
//   } catch (error) {
//     console.error("Error creating workout with details:", error);
//     return [];
//   }
// }

export async function deleteWorkout(workoutId: string) {
  return await db.delete(workouts).where(eq(workouts.id, workoutId));
}

export async function createWorkout(
  userId: string,
  activityData: { name: string; sets: { reps: number; weight?: string }[] }[],
  title?: string
) {
  try {
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
          console.log("set weight", set.weight);
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

    console.log("Workout with activities and sets created successfully.");
    return workout;
  } catch (error) {
    console.error("Error creating workout with details:", error);
    return null;
  }
}

export async function getWorkouts(userId: string): Promise<WorkoutSelect[]> {
  try {
    // Fetch all workouts for the given user
    const workoutsWithDetails = await db
      .select()
      .from(workouts)
      .leftJoin(activities, eq(activities.workoutId, workouts.id))
      .leftJoin(sets, eq(sets.activityId, activities.id));

    if (!workoutsWithDetails)
      throw new Error(`Unable to find workouts for user with id: ${userId}`);

    // Initialize a map to group workouts by ID
    const workoutMap = new Map();

    // Process the flat response to create a nested structure
    workoutsWithDetails.forEach((row) => {
      const { workout, activity, set } = row;

      // If the workout is not already in the map, add it
      if (!workoutMap.has(workout.id)) {
        workoutMap.set(workout.id, {
          ...workout,
          activities: [],
        });
      }

      const currentWorkout = workoutMap.get(workout.id);

      // Find or create the activity in the current workout
      let currentActivity = currentWorkout.activities.find(
        (a) => a.id === activity.id
      );
      if (!currentActivity) {
        currentActivity = { ...activity, sets: [] };
        currentWorkout.activities.push(currentActivity);
      }

      // Add the set to the current activity if it's not already present
      if (set && !currentActivity.sets.find((s) => s.id === set.id)) {
        currentActivity.sets.push(set);
      }
    });

    // Convert the map to an array
    const result = Array.from(workoutMap.values());

    return result;
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return [];
  }
}

type WorkoutWithDetails = {
  id: string;
  title: string;
  userId: string;
  activities: Array<{
    id: string;
    name: string;
    sets: Array<{
      id: string;
      reps: number;
      weight: string;
    }>;
  }>;
};

// export async function getWorkoutById(
//   workoutId: string,
//   userId: string
// ): Promise<WorkoutWithDetails | null> {
//   try {
//     // Fetch the workout details for the given workout ID and user ID
//     const workoutDetails = await db
//       .select({
//         workoutId: workouts.id,
//         workoutTitle: workouts.title,
//         workoutUserId: workouts.userId,
//         activityId: activities.id,
//         activityName: activities.name,
//         setId: sets.id,
//         setReps: sets.reps,
//         setWeight: sets.weight,
//       })
//       .from(workouts)
//       .leftJoin(activities, eq(activities.workoutId, workouts.id))
//       .leftJoin(sets, eq(sets.activityId, activities.id))
//       .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));

//     if (workoutDetails.length === 0) {
//       return null;
//     }

//     // Initialize the result structure
//     const result: WorkoutWithDetails = {
//       id: workoutDetails[0].workoutId,
//       title: workoutDetails[0].workoutTitle,
//       userId: workoutDetails[0].workoutUserId,
//       activities: [],
//     };

//     // Map to keep track of activities and their sets
//     const activityMap = new Map<
//       number,
//       WorkoutWithDetails["activities"][number]
//     >();

//     workoutDetails.forEach((row) => {
//       // If the activity is not already in the map, add it
//       if (!activityMap.has(row.activityId)) {
//         const activity = {
//           id: row.activityId,
//           name: row.activityName,
//           sets: [],
//         };
//         activityMap.set(row.activityId, activity);
//         result.activities.push(activity);
//       }

//       const currentActivity = activityMap.get(row.activityId)!;

//       // Add the set to the current activity if the set exists
//       if (row.setId) {
//         currentActivity.sets.push({
//           id: row.setId,
//           reps: row.setReps,
//           weight: row.setWeight,
//         });
//       }
//     });

//     return result;
//   } catch (error) {
//     console.error("Error fetching workout:", error);
//     return null;
//   }
// }
