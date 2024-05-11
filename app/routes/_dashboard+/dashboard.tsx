import { useLoaderData, Form } from "@remix-run/react";
import {
  LoaderFunctionArgs,
  redirect,
  ActionFunctionArgs,
} from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { Button } from "@radix-ui/themes";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  return { user };
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  return redirect("/dashboard");
}

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <Form method="post">
      <label>
        Excercise: <input name="excercise" />
      </label>
      <label>
        reps: <input name="rep" />
      </label>
      <label>
        weight: <input name="weight" />
      </label>
      <Button>New Workout</Button>
    </Form>
  );
}
