import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  return params.workoutId; // "123"
}

export default function WorkoutRoute() {
  const workoutId = useLoaderData<typeof loader>(); // "123"
  return (
    <div>
      <p>whatup {workoutId}</p>
    </div>
  );
}
