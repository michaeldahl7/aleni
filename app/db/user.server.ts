// import bcrypt from "bcryptjs";
import { db } from "~/db/config.server";
import { eq } from "drizzle-orm"; // Ensure db is properly initialized
import { users } from "~/db/schema.server";

export type User = typeof users.$inferInsert;

export async function getUserById(id: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  if (!user) throw new Error(`Unable to find or create user with id: ${id}`);
  return user;
}

export async function findOrCreateUserByEmail(email: string) {
  console.log("email", email)
  let user = await getUserByEmail(email);
  if (!user) {
    console.log("user not found")
    user = await createUserByEmail(email);
    console.log("user created", user)
  }
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

export async function createUserByEmail(email: string) {
    const newUser: User = { email: email };
    const insertedUsers = await db.insert(users).values(newUser).returning();
    return insertedUsers[0];

}

export async function deleteUserByEmail(email: string) {
  return await db.delete(users).where(eq(users.email, email));
}

// export async function verifyLogin(email: User["email"], password: string) {
//   const userWithPassword = await db.table("users").findOne({
//     where: { email },
//     columns: ["id", "email", "password"], // Specify required columns, assuming password is directly in users table
//   });

//   if (!userWithPassword) {
//     return null;
//   }

//   const isValid = await bcrypt.compare(password, userWithPassword.password);

//   if (!isValid) {
//     return null;
//   }

//   // Remove password from user details before returning
//   const { password: _password, ...userWithoutPassword } = userWithPassword;

//   return userWithoutPassword;
// }
