// import Signup from "~/components/Signup";
import Login from "~/components/Login";

import { unstable_defineLoader as defineLoader } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export const loader = defineLoader(async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
  return user;
});

export default function LoginRoute() {
  return (
    <>
      <Login title="Sign up to Member" />
    </>
  );
}
