import type { MetaFunction } from "@remix-run/node";
import { Flex, Text, Button } from "@radix-ui/themes";
import { Link } from "@remix-run/react";
import Nav from "~/components/Nav";
// import "@radix-ui/themes/styles.css";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/auth.server";

export let loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
  return user;
};

export const meta: MetaFunction = () => {
  return [{ title: "Webapp" }, { name: "description", content: "Welcome" }];
};

export default function Index() {
  return <></>;
}
