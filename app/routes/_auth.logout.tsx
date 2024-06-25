import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import {
  unstable_defineAction as defineAction,
  redirect,
} from "@remix-run/node";

export async function loader() {
  return redirect("/");
}

export const action = defineAction(async ({ request }) => {
  return await authenticator.logout(request, { redirectTo: "/" });
});

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <div>hello {error.data}</div>;
  }
  return <div>Unknown error</div>;
}
