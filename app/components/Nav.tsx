import { Form, Link } from "@remix-run/react";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";

export default function TopNav() {
  return (
    <div className="flex items-center justify-between ">
      <Button asChild>
        <Link to="/">Home</Link>
      </Button>
      <div className="flex items-center justify-between gap-4">
        <ModeToggle />
        <Form action="/logout" method="post">
          <Button>Logout</Button>
        </Form>
      </div>
    </div>
  );
}
