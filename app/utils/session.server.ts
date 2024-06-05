import { createCookieSessionStorage } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";
import invariant from "tiny-invariant";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

// Define the types for the session data
// interface SessionData {
//   auth?: any; // replace `any` with your actual auth data type
//   theme?: string; // or your actual theme data type
// }

// Create a single session storage
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "session", // a generic name for the session cookie
    sameSite: "lax", // helps with CSRF
    path: "/", // cookie works for all routes
    httpOnly: true, // security reasons
    secrets: [process.env.SESSION_SECRET], // actual secret
    secure: process.env.NODE_ENV === "production", // enable in prod only
  },
});

// Utility functions for auth session management
// export async function getAuthSession(request: Request): Promise<any> {
//   const session = await sessionStorage.getSession(
//     request.headers.get("Cookie")
//   );
//   return session.get("auth");
// }

// export async function setAuthSession(
//   authData: any,
//   request: Request
// ): Promise<string> {
//   const session = await sessionStorage.getSession(
//     request.headers.get("Cookie")
//   );
//   session.set("auth", authData);
//   return sessionStorage.commitSession(session);
// }

// // Utility functions for theme session management
// export async function getThemeSession(
//   request: Request
// ): Promise<string | undefined> {
//   const session = await sessionStorage.getSession(
//     request.headers.get("Cookie")
//   );
//   return session.get("theme");
// }

// export async function setThemeSession(
//   themeData: string,
//   request: Request
// ): Promise<string> {
//   const session = await sessionStorage.getSession(
//     request.headers.get("Cookie")
//   );
//   session.set("theme", themeData);
//   return sessionStorage.commitSession(session);
// }

// Export session-related functions
export const { getSession, commitSession, destroySession } = sessionStorage;

// Custom Theme Session Resolver
// export function createCustomThemeSessionResolver() {
//   return {
//     async getTheme(request: Request): Promise<string | undefined> {
//       return await getThemeSession(request);
//     },
//     async setTheme(theme: string, request: Request): Promise<string> {
//       return await setThemeSession(theme, request);
//     },
//   };
// }

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
