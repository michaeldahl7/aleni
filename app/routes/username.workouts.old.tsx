import { useLoaderData, Link, Outlet } from "@remix-run/react";
import { getWorkoutsOfUser } from "~/db/workout.server";
import { requireUserSession } from "~/utils/require-user.server";
import { unstable_defineLoader as defineLoader } from "@remix-run/node";

import { Button } from "~/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import invariant from "tiny-invariant";

export const loader = defineLoader(async ({ request }) => {
  const user = await requireUserSession(request);
  // Get workouts of user from database, how do i want to handle this? Error boundrary?
  try {
    const workouts = await getWorkoutsOfUser(user.id);
    invariant(workouts, "workouts is required");
    return { workouts, user };
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return { error: "Failed to load workouts", status: 500 };
  }
});

export default function WorkoutsRoute() {
  const { workouts } = useLoaderData<typeof loader>();

  return (
    <main className="container flex h-full min-h-[400px] px-4 pb-12 md:px-8">
      <div className="grid w-full grid-cols-4 bg-accent pl-2 md:container md:rounded-3xl md:pr-0">
        <div className="col-span-1 relative">
          <div className="absolute flex flex-col inset-0">
            <ul className="overflow-y-auto overflow-x-hidden pb-8">
              <li className="p-1 pr-0">
                <Button asChild>
                  <Link to="new" className="inline-flex items-center gap-2">
                    <PlusIcon />
                    New Workout
                  </Link>
                </Button>
              </li>
              {workouts!.map((workout) => (
                <li key={workout.id}>
                  <Link to={`${workout.id}`}>{workout.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-span-3 relative">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
