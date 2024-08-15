// app/server/auth.server.ts
import { Authenticator } from "remix-auth";
import {
  SocialsProvider,
  DiscordStrategy,
  GoogleStrategy,
} from "remix-auth-socials";
import { sessionStorage } from "~/utils/session.server";
import { findOrCreateUserByEmail } from "~/db/user.server";
import type { GetUser } from "~/db/schema.server";

import { env } from "~/env";

export const authenticator = new Authenticator<GetUser>(sessionStorage, {
  sessionKey: "_session",
});

const getCallback = (provider: SocialsProvider) => {
  return `${env.HOST_NAME}/auth/${provider}/callback`;
};

authenticator.use(
  new DiscordStrategy(
    {
      clientID: env.DISCORD_CLIENT_ID ?? "",
      clientSecret: env.DISCORD_CLIENT_SECRET ?? "",
      callbackURL: getCallback(SocialsProvider.DISCORD),
    },
    async ({ profile }) => {
      if (profile && profile.__json.verified === false) {
        throw new Error(
          "Discord account is not verified. Please verify your account with Discord and try again."
        );
      }
      const user = await findOrCreateUserByEmail(profile.__json.email!);
      return user;
    }
  )
);

authenticator.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
      callbackURL: getCallback(SocialsProvider.GOOGLE),
    },
    async ({ profile }) => {
      if (profile && profile._json.email_verified === false) {
        throw new Error(
          "Google account is not verified. Please verify your account with Google and try again."
        );
      }
      const user = await findOrCreateUserByEmail(profile.emails[0].value);
      return user;
    }
  )
);
