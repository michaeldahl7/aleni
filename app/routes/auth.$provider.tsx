import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/auth.server";

export let loader = () => redirect("/login");

export let action = ({ request, params }: ActionFunctionArgs) => {
  return authenticator.authenticate(params.provider!, request);
};
