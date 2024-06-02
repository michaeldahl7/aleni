import { Form, Link } from "@remix-run/react";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";

export default function TopNav() {
  return (
    <div className="flex items-center justify-between pt-2 px-2">
      <Button asChild>
        <Link to="/">Home</Link>
      </Button>
      <ModeToggle />
      <Form action="/logout" method="post">
        <Button>Logout</Button>
      </Form>
    </div>
  );
}
