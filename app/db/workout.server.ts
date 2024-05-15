// import bcrypt from "bcryptjs";
import { db } from "~/db/config.server";
import { eq } from "drizzle-orm"; // Ensure db is properly initialized
import {  sets, activities, workouts, insertWorkoutsSchema } from "~/db/schema.server";
import type { Workouts } from "~/db/schema.server";
// import { insertWorkoutsSchema } from "~/db/schema.server";


export async function createWorkout(userId: number, title: string) {
  try {
    const workoutData = {
      userId: userId, // Provide a valid user ID
      date: new Date(),
      title: title
    };

    const validatedWorkoutData  = insertWorkoutsSchema.parse(workoutData);

// Insert validated workout da  ta
    const insertedWorkout = await db.insert(workouts).values(validatedWorkoutData).returning();
    // const date = new Date();
    // // const newWorkout =  { id: userId,  date: date, title: title};
    // const insertedWorkout = await db.insert(workouts).values({ id: userId,  date: date, title: title}).returning();
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


export async function createWorkoutWithDetails(userId: number, title: string, activityData: { name: string, sets: { reps: number, weight: string }[] }[]) {
  try {
    console.log("activityData", activityData)
    const workoutData = {
      userId: userId,
      date: new Date(),
      title: title
    };

    const validatedWorkoutData = insertWorkoutsSchema.parse(workoutData);

    // Start a transaction
    await db.transaction(async (trx) => {
      // Insert the workout
      const [insertedWorkout] = await trx.insert(workouts).values(validatedWorkoutData).returning();
      const workoutId = insertedWorkout.id;

      // Insert activities and sets
      for (let activityIndex = 0; activityIndex < activityData.length; activityIndex++) {
        const activity = activityData[activityIndex];
        const newActivity = { workoutId, name: activity.name, order: activityIndex };
        const [insertedActivity] = await trx.insert(activities).values(newActivity).returning();
        const activityId = insertedActivity.id;

        for (let setIndex = 0; setIndex < activity.sets.length; setIndex++) {
          const set = activity.sets[setIndex];
          console.log("set weight", set.weight)
          const weight = set.weight === "" ? null : set.weight; 
          const newSet = { activityId, reps: set.reps, weight: weight, order: setIndex };
          await trx.insert(sets).values(newSet).returning();
        }
      }

      return insertedWorkout;
    });

    console.log('Workout with activities and sets created successfully.');
    return true;
  } catch (error) {
    console.error("Error creating workout with details:", error);
    return null;
  }
}


export async function getFullWorkouts(userId: number) {
  // Fetch all workouts for the given user
  const workoutsWithDetails = await db
  .select()
  .from(workouts)
  .leftJoin(activities, eq(activities.workoutId, workouts.id))
  .leftJoin(sets, eq(sets.activityId, activities.id));
  
  
  if (!workoutsWithDetails) throw new Error(`Unable to find workouts for user with id: ${userId}`);

  // Initialize a map to group workouts by ID
const workoutMap = new Map();

// Process the flat response to create a nested structure
workoutsWithDetails.forEach(row => {
  const { workout, activity, set } = row;

  // If the workout is not already in the map, add it
  if (!workoutMap.has(workout.id)) {
    workoutMap.set(workout.id, {
      ...workout,
      activities: []
    });
  }

  const currentWorkout = workoutMap.get(workout.id);

  // Find or create the activity in the current workout
  let currentActivity = currentWorkout.activities.find(a => a.id === activity.id);
  if (!currentActivity) {
    currentActivity = { ...activity, sets: [] };
    currentWorkout.activities.push(currentActivity);
  }

  // Add the set to the current activity if it's not already present
  if (set && !currentActivity.sets.find(s => s.id === set.id)) {
    currentActivity.sets.push(set);
  }
});

// Convert the map to an array
const result = Array.from(workoutMap.values());

  
  
  return result;
}

