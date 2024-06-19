import {
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import { requireUser, requireUsername } from "~/utils/require-user.server";

import { Workouts } from "~/components/Workouts";
import { deleteWorkout, getWorkouts } from "~/db/workout.server";
import {
  unstable_defineLoader as defineLoader,
  unstable_defineAction as defineAction,
} from "@remix-run/node";
import invariant from "tiny-invariant";

export const loader = defineLoader(async ({ request }) => {
  const user = await requireUser(request);
  const username = await requireUsername(request);
  const workouts = await getWorkouts(user.id);

  return { workouts, username };
});

export const action = defineAction(async ({ request, params }) => {
  console.log("Action");
  await requireUser(request);
  const formData = await request.formData();
  const workoutId = formData.get("workoutId");
  invariant(workoutId, "Workout ID is required");
  await deleteWorkout(workoutId as string);
  return { ok: true };
});

export default function RouteComponent() {
  const { username, workouts } = useLoaderData<typeof loader>();
  return (
    <>
      <Workouts workouts={workouts} username={username} />
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <div />;
  }
  return <div />;
}
