import { unstable_defineLoader as defineLoader } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getUserByUsername } from "~/db/user.server";
import { authenticator } from "~/utils/auth.server";

export const loader = defineLoader(async ({ params }) => {
  const { username } = params;
  invariant(username, "Username is required");
  const user = await getUserByUsername(username);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }
  return user;
});

export default function UsernameRoute() {
  const user = useLoaderData<typeof loader>();

  return (
    <div className="flex items-center flex-col justify-center h-screen">
      <div className="w-80 h-[20rem] flex flex-col items-center">
        <div className="font-semibold text-2xl mb-9">User Profile</div>
        <div className="text-center">
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
        </div>
      </div>
    </div>
  );
}
