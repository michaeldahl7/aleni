import { authenticator } from "~/utils/auth.server";
import { unstable_defineAction as defineAction } from "@remix-run/node";

export const action = defineAction(async ({ request }) => {
  return await authenticator.logout(request, { redirectTo: "/" });
});
