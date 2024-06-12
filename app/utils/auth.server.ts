// app/server/auth.server.ts
import { Authenticator } from "remix-auth";
import {
  SocialsProvider,
  DiscordStrategy,
  GoogleStrategy,
} from "remix-auth-socials";
import { sessionStorage } from "~/utils/session.server";
import { findOrCreateUserByEmail } from "~/db/user.server";
import type { UserSelect } from "~/db/schema.server";

import dotenv from "dotenv";

dotenv.config();

export const authenticator = new Authenticator<UserSelect>(sessionStorage, {
  sessionKey: "_session",
});

const getCallback = (provider: SocialsProvider) => {
  return `http://${process.env.URL}/auth/${provider}/callback`;
};

authenticator.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      callbackURL: getCallback(SocialsProvider.DISCORD),
    },
    async ({ profile }) => {
      const user = await findOrCreateUserByEmail(profile.__json.email!);

      // Return the user object directly
      return user;
    }
  )
);

authenticator.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      callbackURL: getCallback(SocialsProvider.GOOGLE),
    },
    async ({ profile }) => {
      // here you would find or create a user in your database

      const user = await findOrCreateUserByEmail(profile.emails[0].value);
      return user;
    }
  )
);
