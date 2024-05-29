import { authenticator } from "~/utils/auth.server";
import { LoaderFunctionArgs, json } from "@remix-run/node";

export async function requireUserSession(request: Request) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return user;
}
