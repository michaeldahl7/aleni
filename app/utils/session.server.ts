import { createCookieSessionStorage } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";

import { env } from "~/env";

// Create a single session storage
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session", // a generic name for the session cookie
    sameSite: "lax", // helps with CSRF
    path: "/", // cookie works for all routes
    httpOnly: true, // security reasons
    secrets: [env.SESSION_SECRET], // actual secret
    secure: env.NODE_ENV === "production", // enable in prod only
  },
});



// Export session-related functions
export const { getSession, commitSession, destroySession } = sessionStorage;


export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
