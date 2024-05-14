import { useLoaderData, Link } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import { LoaderFunctionArgs, json } from "@remix-run/node";

const workouts = [
  // Example data structure
  { id: 1, name: "Workout 1",  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return json(workouts);
}

export default function Workouts() {
  const workouts = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Workouts</h1>
      <ul>
        {workouts.map(workout => (
          <li key={workout.id}>{workout.name}</li>
        ))}
      </ul>
      <Link to="/workouts/new">Add New Workout</Link>
    </div>
  );
}
