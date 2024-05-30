import type { MetaFunction } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { Outlet } from "@remix-run/react";
import { sessionStorage } from "~/utils/session.server";
import { unstable_defineLoader as defineLoader } from "@remix-run/node";

export const loader = defineLoader(async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/workouts",
    failureRedirect: "/login",
  });
  return user;
});

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   const user = await authenticator.isAuthenticated(request, {
//     successRedirect: "/workouts",
//     failureRedirect: "/login",
//   });
//   return user;
// };

export const meta: MetaFunction = () => {
  return [{ title: "Webapp" }, { name: "description", content: "Welcome" }];
};

export default function Index() {
  return <>{/* <Outlet /> */}</>;
}
