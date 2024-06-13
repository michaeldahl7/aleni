import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
  useLocation,
  Link,
} from "@remix-run/react";
import posthog from "posthog-js";
import { useEffect } from "react";
import clsx from "clsx";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";
import { LoaderFunctionArgs } from "@remix-run/node";
import { themeSessionResolver } from "~/utils/session.server";

import "./styles.css";
import { Button } from "./components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);
  return {
    theme: getTheme(),
  };
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}

export function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  const location = useLocation();
  useEffect(() => {
    posthog.capture("$pageview");
  }, [location]);
  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>

      <body>
        <div className="flex h-screen flex-col justify-between">
          <Outlet />
        </div>

        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

interface ErrorBoundaryProps {
  theme: string | null;
}

export function ErrorBoundary({ theme }: ErrorBoundaryProps) {
  const error = useRouteError();
  console.error(error);
  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="p-4">
          <h1 className="text-2xl font-bold">An error has occurred</h1>
          <p className="mt-2">
            Sorry, something went wrong. Please try again later.
          </p>
          <Button asChild>
            <Link to="/">Home</Link>
          </Button>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
