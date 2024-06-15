import * as Sentry from "@sentry/remix";
/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser, useLocation, useMatches } from "@remix-run/react";
import { startTransition, StrictMode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";

import posthog from "posthog-js";

Sentry.init({
    dsn: "https://39c42e33e3eea86cad9cacc0bbc9148f@o4507426097070080.ingest.us.sentry.io/4507426101854208",
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,

    integrations: [Sentry.browserTracingIntegration({
      useEffect,
      useLocation,
      useMatches
    }), Sentry.replayIntegration()]
})

function PosthogInit() {
  useEffect(() => {
    posthog.init("phc_tHTjnd5bMNYryrsn4yeIEEBKeP6hAyimi4omj2YZ5Ra", {
      api_host: "https://us.i.posthog.com",
    });
  }, []);

  return null;
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
      <PosthogInit />
    </StrictMode>
  );
});