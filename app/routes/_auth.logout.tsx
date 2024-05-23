import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await authenticator.logout(request, { redirectTo: "/" });
};
