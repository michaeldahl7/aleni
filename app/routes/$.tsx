import { Link } from "@remix-run/react";

import { Button } from "~/components/ui/button";

export async function loader() {
  throw new Response("Not found", { status: 404 });
}

export default function NotFoundPage() {
  return (
    <div>
      <h3>OOPS! Page not found.</h3>

      <Button asChild>
        <Link to="/workouts">Go home</Link>
      </Button>
    </div>
  );
}
