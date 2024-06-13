import { Link, useLocation } from "@remix-run/react";
import { GeneralErrorBoundary } from "~/components/ErrorBoundary";

import { Button } from "~/components/ui/button";

export async function loader() {
  throw new Response("Not found", { status: 404 });
}

export function ErrorBoundary() {
  const location = useLocation();
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: () => (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1>We can't find this page:</h1>
              <pre className="whitespace-pre-wrap break-all text-body-lg">
                {location.pathname}
              </pre>
            </div>
            <Button asChild>
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        ),
      }}
    />
  );
}
