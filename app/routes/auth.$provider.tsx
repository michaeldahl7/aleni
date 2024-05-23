import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export const loader = () => redirect("/login");

export const action = ({ request, params }: ActionFunctionArgs) => {
  return authenticator.authenticate(params.provider!, request);
};
