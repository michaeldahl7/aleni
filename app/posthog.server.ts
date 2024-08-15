import { PostHog } from "posthog-node";
import { env } from "./env";


let posthogNodeClient: PostHog | null = null;

export default function PostHogNodeClient(): PostHog {
  if (!posthogNodeClient) {
    posthogNodeClient = new PostHog(env.POSTHOG_API_KEY, {
      host: env.POSTHOG_HOST,
    });
  }
  return posthogNodeClient;
}
