import { useLoaderData, Link, NavLink, Outlet } from "@remix-run/react";
import { getWorkoutsOfUser } from "~/db/workout.server";
import { requireUserSession } from "~/utils/require-user.server";
import { unstable_defineLoader as defineLoader } from "@remix-run/node";
import Nav from "~/components/Nav";

export const loader = defineLoader(async ({ request }) => {
  const user = await requireUserSession(request);
  // Get workouts of user from database, how do i want to handle this? Error boundrary?
  try {
    const workouts = await getWorkoutsOfUser(user.id!);
    return workouts;
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return { error: "Failed to load workouts", status: 500 };
  }
});

export default function WorkoutsRoute() {
  const workouts = useLoaderData<typeof loader>();

  return (
    <div>
      <Nav />
      <h1>Workouts</h1>
      <div className="grid grid-cols-[350px,1fr]">
        <div>
          <ul>
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
          </ul>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
