import Login from "~/components/Login";

import { unstable_defineLoader as defineLoader } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { Outlet } from "@remix-run/react";
import { GeneralErrorBoundary } from "~/components/ErrorBoundary";

export const loader = defineLoader(async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
  return user;
});

export default function LoginRoute() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen">
      <Login title="Log in to Aleni" />
      <Outlet />
    </div>
  );
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
