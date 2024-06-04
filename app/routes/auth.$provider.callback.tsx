// app/routes/auth/$provider.callback.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export const loader = ({ request, params }: LoaderFunctionArgs) => {
  return authenticator.authenticate(params.provider!, request, {
    successRedirect: "/",
    failureRedirect: "/",
  });
};
