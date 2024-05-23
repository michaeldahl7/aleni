import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";

import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
// import "./tailwind.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <body>
        <Theme
          accentColor="mint"
          grayColor="sand"
          panelBackground="solid"
          scaling="100%"
          radius="medium"
          appearance="dark"
        >
          {children}
          <ScrollRestoration />
          <Scripts />
        </Theme>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div>An error has occurred</div>
        <Scripts />
      </body>
    </html>
  );
}
