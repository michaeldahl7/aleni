import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/auth.server";

export let action = async ({ request, params }: ActionFunctionArgs) => {
  await authenticator.logout(request, { redirectTo: "/" });
};
