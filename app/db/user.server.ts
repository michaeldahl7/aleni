import { db } from "~/db/config.server";
import { eq } from "drizzle-orm"; // Ensure db is properly initialized
import { users } from "~/db/schema.server";
import type { UserSelect } from "~/db/schema.server";
import PostHogNodeClient from "~/posthog.server";

// import posthog from "posthog-js";

export async function getUserById(id: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  if (!user) throw new Error(`Unable to find user with id: ${id}`);
  return user;
}

export async function findOrCreateUserByEmail(
  email: string
): Promise<UserSelect> {
  console.log("email", email);
  let user = await getUserByEmail(email);
  if (!user) {
    console.log("user not found");
    user = await createUserByEmail(email);

    const phClient = PostHogNodeClient();
    phClient.capture({
      distinctId: user.email,
      event: "user signed up",
    });
  }
  return user;
}

export async function isUsernameTaken(username: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });
  return user ? true : false;
}

export async function getUserByUsername(username: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });
  if (!user) throw new Error(`Unable to find user with username: ${username}`);
  return user;
}

export async function getUserByEmail(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return user || null;
  } catch (error) {
    console.error("Error fetching user by email:", error);

    return null;
  }
}

export async function createUserByEmail(email: string): Promise<UserSelect> {
  // const newUser: Users = { email: email };
  const insertedUsers = await db
    .insert(users)
    .values({ email: email })
    .returning();
  return insertedUsers[0];
}

export async function createUsername(id: string, username: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  if (!user) throw new Error(`Unable to find user with id: ${id}`);
  await db.update(users).set({ username }).where(eq(users.id, id));
  return user;
}

export async function deleteUserByEmail(email: string) {
  return await db.delete(users).where(eq(users.email, email));
}
