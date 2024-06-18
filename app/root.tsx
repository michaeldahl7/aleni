import { captureRemixErrorBoundaryError, withSentry } from "@sentry/remix";
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
import {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { themeSessionResolver } from "~/utils/session.server";

import "~/styles/tailwind.css";
import tailwindStyleSheetUrl from "~/styles/tailwind.css?url";
import fontStyleSheetUrl from "~/styles/inter.css?url";
import { Button } from "~/components/ui/button";
import { Toaster } from "~/components/ui/sonner";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStyleSheetUrl },
    { rel: "preload", href: fontStyleSheetUrl, as: "style" },
    { rel: "stylesheet", href: fontStyleSheetUrl },
  ].filter(Boolean);
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data ? "Aleni" : "Error | Aleni" },
    { name: "description", content: `Your assistant` },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);
  return {
    theme: getTheme(),
  };
}

function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}

export default withSentry(AppWithProviders);

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
        <Outlet />

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
  captureRemixErrorBoundaryError(error);
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
