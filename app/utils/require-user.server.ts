import { authenticator } from "~/utils/auth.server";

export async function requireUserSession(request: Request) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return user;
}
