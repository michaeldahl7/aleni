import { z } from "zod";

export const UserSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(12, { message: "Password should be at least 12 characters long" }),
});
