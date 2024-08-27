import { createWorkout } from "~/db/workout.server";
import {
  unstable_defineAction as defineAction,
  json,
  redirect,
} from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { workoutSchema } from "~/routes/__workout-editor";
import { parseWithZod } from "@conform-to/zod";
import type {
	NewWorkout
  } from "~/db/schema.server";
import { requireUser } from "./require-user.server";

export const action = defineAction(async ({ request }) => {
	const user = await requireUser(request);
//   const user = await authenticator.isAuthenticated(request, {
//     failureRedirect: "/login",
//   });
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: workoutSchema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }
  let workoutId ="";

  try {
	let newWorkout: NewWorkout = {} as NewWorkout;
	newWorkout.userId = submission.value.userId;
	newWorkout.title = submission.value.title;
	newWorkout.activities = submission.value.activities;

    const result = await createWorkout(newWorkout
    );

	workoutId = result[0].workoutId;
  } catch (error) {
    return json(
      submission.reply({
        formErrors: ["Failed to create workout. Please try again later."],
      })
    );
  }

  throw redirect(`/${user.username}/workouts/${workoutId}`);
});
