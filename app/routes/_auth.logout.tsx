import { authenticator } from "~/utils/auth.server";
import { unstable_defineAction as defineAction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import posthog from "posthog-js";
import PostHogNodeClient from "~/posthog.server";

export async function loader() {
  return redirect("/");
}

export const action = defineAction(async ({ request }) => {
  //   const phClient = PostHogNodeClient();
  //   phClient.shutdown();

  return await authenticator.logout(request, { redirectTo: "/" });
});
