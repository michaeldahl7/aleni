import { GeneralErrorBoundary } from "~/components/ErrorBoundary";
import { WorkoutEditor, createEmptyActivity } from "~/routes/__workout-editor";
import { authenticator } from "~/utils/auth.server";
import { UserSelect } from "~/db/schema.server";
import { Workout } from "~/db/workout.server";  

import { unstable_defineLoader as defineLoader } from "@remix-run/node";
export { action } from "~/utils/__workout-editor.server";
import { useLoaderData } from "@remix-run/react";

const createEmptyWorkout: Workout = () => ({
  id: "",
  title: "",
  activities: [createEmptyActivity()],
});

// const createEmptyWorkout = () => ({
//   title: "",
//   activities: [createEmptyActivity()],
// });

export const loader = defineLoader(async ({ request, params }) => {
  const user: UserSelect = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const emptyWorkout = createEmptyWorkout;
  return { user };
});

export default function WorkoutNew() {
  const workout = {
    id: "",
    title: "",
    activities: [createEmptyActivity()],
  };
  const { user } = useLoaderData<typeof loader>();
  return <WorkoutEditor workout={workout} userId={user.id} />;
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: ({ params }) => (
          <p>No workout with the id {params.workoutId} exists</p>
        ),
      }}
    />
  );
}
