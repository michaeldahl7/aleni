import type { MetaFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { unstable_defineLoader as defineLoader } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Dumbbell } from "lucide-react";

export const loader = defineLoader(async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/workouts",
  });
  return user;
});

export const meta: MetaFunction = () => {
  return [{ title: "Webapp" }, { name: "description", content: "Welcome" }];
};

export default function IndexRoute() {
  return (
    <>
      <div className="flex items-center flex-col justify-center h-screen">
        <div className="w-80 h-[20rem] flex flex-col items-center">
          <Dumbbell size={48} strokeWidth={1} className="mb-4" />
          <div className=" font-semibold text-2xl mb-9">Welcome to Member</div>

          <div className=" flex flex-col items-center w-full gap-3 text-sm">
            <Button className="w-2/4" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button className="w-2/4" asChild>
              <Link to="/signup">Signup</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
