import { useLoaderData } from "@remix-run/react";
import { WorkoutEditor } from "~/routes/__workout-editor";
import { unstable_defineLoader as defineLoader } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { getWorkout } from "~/db/workout.server";
import invariant from "tiny-invariant";

export { action } from "~/utils/__workout-editor.server";

export const loader = defineLoader(async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  invariant(params.workoutId, "workoutId is required");
  const workout = await getWorkout(params.workoutId);
  invariant(workout, "workout is required");

  return { workout, user };
});

export default function EditWorkout() {
  const { workout, user } = useLoaderData<typeof loader>();

  return <WorkoutEditor workout={workout} userId={user.id} />;
}