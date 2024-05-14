import type { MetaFunction } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
  return user;
};

export const meta: MetaFunction = () => {
  return [{ title: "Webapp" }, { name: "description", content: "Welcome" }];
};

export default function Index() {
  return <></>;
}
