import { GeneralErrorBoundary } from "~/components/ErrorBoundary";
import { WorkoutEditor } from "~/routes/__workout-editor";
import { authenticator } from "~/utils/auth.server";
import { UserSelect } from "~/db/schema.server";

import { unstable_defineLoader as defineLoader } from "@remix-run/node";
export { action } from "~/utils/__workout-editor.server";
import { useLoaderData } from "@remix-run/react";

export const loader = defineLoader(async ({ request }) => {
  const user: UserSelect = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return user;
});

export default function WorkoutNew() {
  const user = useLoaderData<typeof loader>();
  const emptyWorkout = {
    id: "",
    title: "",
    activities: [
      {
        name: "",
        sets: [
          { reps: null, weight: "" },
          { reps: null, weight: "" },
          { reps: null, weight: "" },
        ],
      },
    ],
  };
  //   const { user } = useLoaderData<typeof loader>();
  return (
    <div className="flex justify-center">
      <WorkoutEditor workout={emptyWorkout} userId={user.id} />
    </div>
  );
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
