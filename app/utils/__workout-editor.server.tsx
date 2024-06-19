import { createWorkout } from "~/db/workout.server";
import {
  unstable_defineAction as defineAction,
  json,
  redirect,
} from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { workoutSchema } from "~/routes/__workout-editor_old";
import { parseWithZod } from "@conform-to/zod";

export const action = defineAction(async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: workoutSchema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }
  let workout;
  try {
    workout = await createWorkout(
      submission.value.userId,
      submission.value.activities,
      submission.value.title
    );
  } catch (error) {
    return json(
      submission.reply({
        formErrors: ["Failed to create workout. Please try again later."],
      })
    );
  }

  throw redirect(`/${user.username}/workouts/${workout.id}`);
});
