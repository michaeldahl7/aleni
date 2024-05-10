// app/server/auth.server.ts
import { Authenticator } from "remix-auth";
import { SocialsProvider, DiscordStrategy } from "remix-auth-socials";
import { sessionStorage } from "~/session.server";
import { findOrCreateUserByEmail } from "~/db/user.server";
import type { User } from "~/db/user.server";

export let authenticator = new Authenticator<User>(sessionStorage, {
  sessionKey: "_session",
});

const getCallback = (provider: SocialsProvider) => {
  return `http://localhost:5173/auth/${provider}/callback`;
};

authenticator.use(
  new DiscordStrategy(
    {
      clientID: "1238220538468499516",
      clientSecret: "BgH7nHwWup37txVDR6RjkYMf1fegiFAL",
      callbackURL: getCallback(SocialsProvider.DISCORD),
    },
    async ({ accessToken, refreshToken, profile }) => {
      const user = await findOrCreateUserByEmail(profile.__json.email!);

      return {
        id: user?.id,
        email: user?.email!,
      };
    }
  )
);
