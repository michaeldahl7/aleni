import { PostHog } from "posthog-node";
import dotenv from "dotenv";

dotenv.config();

let posthogNodeClient: PostHog | null = null;

export default function PostHogNodeClient(): PostHog {
  if (!posthogNodeClient) {
    posthogNodeClient = new PostHog(process.env.POSTHOG_API_KEY, {
      host: process.env.POSTHOG_HOST,
    });
  }
  return posthogNodeClient;
}
