import { createWorkout } from "~/db/workout.server";

import {
  unstable_defineAction as defineAction,
  json,
  redirect,
} from "@remix-run/node";
import { UserSelect } from "~/db/schema.server";
import { authenticator } from "~/utils/auth.server";
import { workoutSchema } from "./__workout-editor";
import { parseWithZod } from "@conform-to/zod";

export const action = defineAction(async ({ request }) => {
  const user: UserSelect = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: workoutSchema,
  });

  if (submission.status !== "success") {
    console.log("submission", submission);
    return json(submission.reply());
  }
  const workout = await createWorkout(
    submission.value.userId,
    submission.value.activities,
    submission.value.title
  );

  if (!workout) {
    return json(
      submission.reply({
        formErrors: ["Failed to create workout. Please try again later."],
      })
    );
  }
  console.log("reached en of action");
  throw redirect(`/${user.username}/workouts/${workout.id}`);
});
