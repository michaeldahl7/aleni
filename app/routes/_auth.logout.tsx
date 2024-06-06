import { authenticator } from "~/utils/auth.server";
import {
  unstable_defineAction as defineAction,
  redirect,
} from "@remix-run/node";

export async function loader() {
  return redirect("/");
}

export const action = defineAction(async ({ request }) => {
  return await authenticator.logout(request, { redirectTo: "/" });
});
