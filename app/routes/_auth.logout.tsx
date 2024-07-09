import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import {
  unstable_defineAction as defineAction,
  redirect,
} from "@remix-run/node";
import { GeneralErrorBoundary } from "~/components/ErrorBoundary";

export async function loader() {
  return redirect("/");
}

export const action = defineAction(async ({ request }) => {
  return await authenticator.logout(request, { redirectTo: "/" });
});

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
