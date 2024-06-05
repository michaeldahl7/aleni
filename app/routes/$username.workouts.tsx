import { useLoaderData, Link, NavLink, Outlet } from "@remix-run/react";
import { getWorkoutsOfUser } from "~/db/workout.server";
import { requireUserSession } from "~/utils/require-user.server";
import { unstable_defineLoader as defineLoader } from "@remix-run/node";
import Nav from "~/components/Nav";
import { ModeToggle } from "~/components/ModeToggle";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

export const loader = defineLoader(async ({ request }) => {
  const user = await requireUserSession(request);
  // Get workouts of user from database, how do i want to handle this? Error boundrary?
  try {
    const workouts = await getWorkoutsOfUser(user.id!);
    return { workouts, user };
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return { error: "Failed to load workouts", status: 500 };
  }
});

export default function WorkoutsRoute() {
  const { workouts, user } = useLoaderData<typeof loader>();

  return (
    <main className="container flex h-full min-h-[400px] px-0 pb-12 md:px-8">
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
                {/* <NavLink
                  to="new"
                  className={({ isActive }) =>
                    cn(navLinkDefaultClassName, isActive && "bg-accent")
                  }
                >
                  <Icon name="plus">New Note</Icon>
                </NavLink> */}
              </li>
            </ul>
          </div>
          {/* <ul>
            <Link to="/workouts/new">Add New Workout</Link>
            {workouts &&
              workouts.map((workout) => (
                <li key={workout.id}>
                  <NavLink
                    to={`/workouts/${workout.id}`}
                    preventScrollReset
                    prefetch="intent"
                  >
                    {workout.title} - {workout.id}
                  </NavLink>
                </li>
              ))}
          </ul> */}
        </div>
        <div className="col-span-3 relative">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
