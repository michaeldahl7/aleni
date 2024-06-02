import { Link } from "@remix-run/react";
import { Button } from "./ui/button";

function MyErrorBoundary() {
  return (
    <div>
      <h1>Oops! Something went wrong.</h1>
      <p>We encountered an error while processing your request.</p>
      <Button asChild>
        <Link to="/workouts">Go home</Link>
      </Button>
    </div>
  );
}

export default MyErrorBoundary;
