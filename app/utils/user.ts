// import { type SerializeFrom } from "@remix-run/node";
// import { useRouteLoaderData } from "@remix-run/react";
// import { type loader as UserLoader } from "~/routes/$username.tsx";

export function isOnboarded(user: any) {
  return user && user.username;
}

// function isUser(user: any): user is SerializeFrom<typeof UserLoader>["user"] {
//   return user && typeof user === "object" && typeof user.id === "string";
// }

// export function useOptionalUser() {
//   const data = useRouteLoaderData<typeof UserLoader>(
//     "app/routes/$username.tsx"
//   );
//   if (!data || !isUser(data.user)) {
//     return undefined;
//   }
//   return data.user;
// }

// export function useUser() {
//   const maybeUser = useOptionalUser();
//   if (!maybeUser) {
//     throw new Error(
//       "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
//     );
//   }
//   return maybeUser;
// }
