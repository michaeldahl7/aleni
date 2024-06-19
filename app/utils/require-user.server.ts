import { authenticator } from "~/utils/auth.server";

export async function requireUser(request: Request) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return user;
}

export async function requireUsername(request: Request) {
  const user = await requireUser(request);
  if (user.username === null) {
    throw new Error("Username is required");
  }
  return user.username;
}
