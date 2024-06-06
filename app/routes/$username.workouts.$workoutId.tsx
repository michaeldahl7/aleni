// import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { UserSelect } from "~/db/schema.server";
import { deleteWorkout, getWorkoutById } from "~/db/workout.server";
import { authenticator } from "~/utils/auth.server";
import invariant from "tiny-invariant";

import {
  unstable_defineLoader as defineLoader,
  unstable_defineAction as defineAction,
  redirect,
} from "@remix-run/node";

export const loader = defineLoader(async ({ request, params }) => {
  const user: UserSelect = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  invariant(params.workoutId, "Workout ID is required");
  const workout = await getWorkoutById(params.workoutId);
  invariant(workout, "Workout is required");

  return { workout, user };
});

export const action = defineAction(async ({ request, params }) => {
  const user: UserSelect = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  invariant(params.workoutId, "Workout ID is required");
  await deleteWorkout(params.workoutId);
  throw redirect(`/${user.username}/workouts`);
});

export default function WorkoutRoute() {
  const { workout } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <div>
      <h1>{workout.title}</h1>

      <ul>
        {workout.activities.map((activity, index) => (
          <li key={index}>
            <h2>{activity.name}</h2>
            <ul>
              {activity.sets.map((set, setIndex) => (
                <li key={setIndex}>
                  Reps: {set.reps}, Weight: {set.weight}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(`edit`)}>Edit</button>
      <Form method="post">
        <button type="submit">Delete</button>
      </Form>
    </div>
  );
}
