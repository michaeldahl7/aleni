// import bcrypt from "bcryptjs";
import { db } from "~/db/config.server";
import { eq } from "drizzle-orm"; // Ensure db is properly initialized
import { users } from "~/db/schema.server";
import { InferInsertModel } from "drizzle-orm";
export type User = InferInsertModel<typeof users>;

export async function getUserById(id: number) {
  return db.select().from(users).where(eq(users.id, id)).get();
  //   return db.query.users.findMany({
  // 	where: eq(users.id, 1)
  //   })
  //   return db.table("users").findOne({ id });
}

export async function findOrCreateUserByEmail(email: string) {
  console.log("reached find or create, email:", email);
  let user = await getUserByEmail(email);
  console.log("User exists: ", user);
  if (!user) {
    user = await createUserByEmail(email);
    console.log("User didnt exist, just created: ", user);
  }
  return user;
}

export async function getUserByEmail(email: string) {
  try {
    // Await the asynchronous operation to complete and get the result.
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();
    return user || null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    // Handle errors appropriately.
    return null;
  }
}

export async function createUserByEmail(email: string) {
  try {
    const newUser: User = { email: email };
    // Await the asynchronous insert operation to complete.
    const insertedUsers = await db
      .insert(users)
      .values(newUser)
      .returning()
      .all();
    return insertedUsers[0];
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

export async function deleteUserByEmail(email: string) {
  return db.delete(users).where(eq(users.email, email));
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
