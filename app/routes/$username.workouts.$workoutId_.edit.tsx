import { useLoaderData } from "@remix-run/react";
import { WorkoutEditor } from "~/routes/__workout-editor";
import { unstable_defineLoader as defineLoader } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { getWorkoutById } from "~/db/workout.server";
import invariant from "tiny-invariant";

export const loader = defineLoader(async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  invariant(params.workoutId, "workoutId is required");
  const workout = await getWorkoutById(params.workoutId);
  return workout;
});

export default function EditWorkout() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
    <div>Hello</div>
    {/* <WorkoutEditor {data}/> */}
    </>
  );
}
