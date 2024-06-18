import { useLoaderData } from "@remix-run/react";
import { WorkoutEditor } from "~/routes/__workout-editor";
import { unstable_defineLoader as defineLoader } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { getWorkoutById } from "~/db/workout.server";
import invariant from "tiny-invariant";
import Table from "~/components/Table";

export const loader = defineLoader(async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  invariant(params.workoutId, "workoutId is required");
  const workout = await getWorkoutById(params.workoutId);
  invariant(workout, "workout is required");

  return { workout, user };
});

export default function EditWorkout() {
  const { workout, user } = useLoaderData<typeof loader>();
  //   return <WorkoutEditor workout={workout} userId={user.id} />;
  return <WorkoutEditor workout={workout} userId={user.id} />;
}

{
  /* <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
<div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
  <div className="flex items-center gap-4">
	<Button variant="outline" size="icon" className="h-7 w-7">
	  <ChevronLeftIcon className="h-4 w-4" />
	  <span className="sr-only">Back</span>
	</Button>
	<h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
	  Pro Controller
	</h1>
	<Badge variant="outline" className="ml-auto sm:ml-0">
	  In stock
	</Badge>
	<div className="hidden items-center gap-2 md:ml-auto md:flex">
	  <Button variant="outline" size="sm">
		Discard
	  </Button>
	  <Button size="sm">Save Product</Button>
	</div>
  </div> */
}
