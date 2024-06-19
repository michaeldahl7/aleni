// import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";
import { UserSelect } from "~/db/schema.server";
import { deleteWorkout, getWorkoutById } from "~/db/workout.server";
import { authenticator } from "~/utils/auth.server";
import invariant from "tiny-invariant";
import { TrashIcon, Pencil1Icon } from "@radix-ui/react-icons";

import {
  unstable_defineLoader as defineLoader,
  unstable_defineAction as defineAction,
  redirect,
} from "@remix-run/node";
import { Button } from "~/components/ui/button";

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
    <div className="absolute inset-0 flex flex-col px-10">
      <h2 className="text-6xl mb-12 pt-6">{workout.title}</h2>
      <div>{workout.title}</div>

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
      <div className="flex justify-end gap-4">
        <Form method="post">
          <Button variant="destructive" type="submit" className="flex gap-1">
            <TrashIcon />
            Delete
          </Button>
        </Form>
        <Button variant="default" asChild>
          <Link to="edit" className="flex gap-1">
            <Pencil1Icon />
            Edit
          </Link>
        </Button>
      </div>
    </div>
  );
}
