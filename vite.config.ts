import { sentryVitePlugin } from "@sentry/vite-plugin";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { remixDevTools } from "remix-development-tools";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remixDevTools(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        unstable_singleFetch: true,
      },
    }),
    tsconfigPaths(),
    sentryVitePlugin({
      org: "aleni",
      project: "javascript-remix",
    }),
  ],
  server: {
    open: true,
  },

  build: {
    sourcemap: true,
  },
});
