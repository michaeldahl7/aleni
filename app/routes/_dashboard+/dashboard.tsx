import { Link, Form } from "@remix-run/react";
import {
  LoaderFunctionArgs,
  redirect,
  ActionFunctionArgs, 
  json
} from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });


  console.log("user email", user.id);
  return json({
    user: user
  })

};

// export async function action({ request }: ActionFunctionArgs) {

//   return redirect("/dashboard");
// }

export default function Dashboard() {

  return (
    <div>
      <h1>Workout Application</h1>
      <Link to="/workouts">View Workouts</Link>
      <br />
      <Link to="/workouts/new">Add New Workout</Link>
      <Form action="/logout" method="post">
        <button>Logout</button>
      </Form>
    </div>
  );
}
