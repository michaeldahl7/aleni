import { useLoaderData, Form } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/auth.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  return { user };
};

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>
        Welcome id: {user.id} and email: {user.email}!
      </h1>
      <p>This is a protected page</p>
      <Form action="/logout" method="post">
        <button>Logout</button>
      </Form>
    </div>
  );
}
