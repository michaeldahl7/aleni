import { useLoaderData, Form } from "@remix-run/react";
import {
  LoaderFunctionArgs,
  redirect,
  ActionFunctionArgs,
} from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  return { user };
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  console.log("hey");
  return redirect("/dashboard");
}

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <Form method="post">
      <label>
        Title: <input className="border" name="title" />
      </label>
      <button type="submit" className="p-2 bg-zinc-300 border">
        Create post
      </button>
    </Form>
  );
}
