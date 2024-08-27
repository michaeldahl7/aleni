
import { authenticator } from "~/utils/auth.server";
import type { ActionFunctionArgs } from "@remix-run/node";
import { GetUser } from "~/db/schema.server";

export const action = ({ request, params }: ActionFunctionArgs) => {
	const tryoutUser: GetUser = {
		id: "tryout",
		username: "tryout",
		email: "tryout@example.com",
		createdAt: new Date(),
		updatedAt: null
	  };

  return authenticator.authenticate("tryout", request, {
    successRedirect: "/tryout/home",
    failureRedirect: "/login",
    context: tryoutUser,
  });
};