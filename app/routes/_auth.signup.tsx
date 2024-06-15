import Login from "~/components/Login";
import { unstable_defineLoader as defineLoader } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import { Button } from "~/components/ui/button";

export const loader = defineLoader(async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
  return user;
});

export default function LoginRoute() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen">
      <div className="min-h-[32px] px-4 pb-1 pt-1">{error ? error : null}</div>
      <Login title="Create your account" />
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?
        </p>
        <Button variant="link" asChild>
          <Link to="/login">
            <span className="hover:underline flex items-center">
              Login -&gt;
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
