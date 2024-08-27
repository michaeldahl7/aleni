
import { ActionFunctionArgs } from "@remix-run/node";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { authenticator } from "~/utils/auth.server";
import { useFetcher } from "@remix-run/react";

import type {
	NewWorkout, GetWorkout
  } from "~/db/schema.server";
import { createWorkout, deleteWorkout } from "~/db/workout.server";
import { requireUser } from "~/utils/require-user.server";

  const setSchema = z.object({
	reps: z.number({ required_error: "Reps are required" }).min(1),
	weight: z.number().optional(),
  });

  const activitySchema = z.object({
	name: z.string({ required_error: "Please provide a name" }).min(1),
	sets: z
	  .array(setSchema)
	  .nonempty({ message: "Please provide at least one set" }),
  });

  export const workoutSchema = z.object({
	userId: z.string(),
	//   title: z.string().optional(),
	title: z.string({ required_error: "Please provide a workout title" }),
	activities: z
	  .array(activitySchema)
	  .nonempty({ message: "Please provide at least one activity" }),
  });
//   let newWorkout: NewWorkout = {} as NewWorkout;
//   newWorkout.userId = submission.value.userId;
//   newWorkout.title = submission.value.title;
//   newWorkout.activities = submission.value.activities;


const WorkoutUpdateSchema = z.discriminatedUnion("intent", [
	z.object({
	intent: z.literal("update"),
	}),
	z.object({ intent: z.literal("delete"), workoutId: z.string() }),
	z.object({ intent: z.literal("create"), 	userId: z.string(),
		//   title: z.string().optional(),
		title: z.string({ required_error: "Please provide a workout title" }),
		activities: z
		  .array(activitySchema)
		  .nonempty({ message: "Please provide at least one activity" }),
	  }),
],
);


export const action = async ({ request }: ActionFunctionArgs) => {
	const user = await requireUser(request);
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: WorkoutUpdateSchema,
  });
  if (submission.status !== "success") {
    return { ok: false };
  }

  if (submission.value.intent === "update") {
    //trpc request or db call

  }
  if (submission.value.intent === "delete") {
    //trpc request or db call
	await deleteWorkout(submission.value.workoutId);
  }
  if (submission.value.intent === "create") {
	let newWorkout: NewWorkout = {} as NewWorkout;
	newWorkout.userId = submission.value.userId;
	newWorkout.title = submission.value.title;
	newWorkout.activities = submission.value.activities;

    const result = await createWorkout(newWorkout);

	const workoutId = result[0].workoutId;
	return { ok: true, workoutId };
  }
  //db call

  return { ok: true };
};

export const useWorkoutUpdateMutation = () => {
  //define fetcher
};
