import { Form } from "@remix-run/react";
import { SocialsProvider } from "remix-auth-socials";
import { Button } from "@radix-ui/themes";

interface SocialButtonProps {
  provider: SocialsProvider;
  label: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ provider, label }) => (
  <Form action={`/auth/${provider}`} method="post">
    <Button>{label}</Button>
  </Form>
);

export default function Login() {
  return (
    <>
      <SocialButton
        provider={SocialsProvider.DISCORD}
        label="Login with Discord"
      />
    </>
  );
}
