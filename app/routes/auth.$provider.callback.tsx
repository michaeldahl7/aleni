// app/routes/auth/$provider.callback.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/auth.server";

export let loader = ({ request, params }: LoaderFunctionArgs) => {
  return authenticator.authenticate(params.provider!, request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
};
