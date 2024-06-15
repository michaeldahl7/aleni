import { unstable_defineLoader as defineLoader } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import { ModeToggle } from "~/components/ModeToggle";

import { Button } from "~/components/ui/button";

import { requireUserSession } from "~/utils/require-user.server";

export const loader = defineLoader(async ({ params, request }) => {
  const user = await requireUserSession(request);
  const { username } = params;
  if (user && user.username !== username) {
    throw new Response("Not Found", { status: 404 });
  }

  return user;
});

export default function UsernameRoute() {
  return (
    <>
      <header className="container py-6">
        <nav className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8">
          <Button asChild>
            <Link to="/">Home</Link>
          </Button>
          <div className="flex items-center justify-between gap-4">
            {/* <ModeToggle /> */}
            <Form action="/logout" method="post">
              <Button>Logout</Button>
            </Form>
          </div>
        </nav>
      </header>
      <div className="flex-1">
        <Outlet />
      </div>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
