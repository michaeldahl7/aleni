import { Form } from "@remix-run/react";
import { SocialsProvider } from "remix-auth-socials";
// import { Button } from "@radix-ui/themes";
import { authenticator } from "~/utils/auth.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  Container,
  Section,
  Card,
  Button,
  Box,
  Heading,
} from "@radix-ui/themes";
import { forwardRef } from "react";

interface SocialButtonProps {
  label: string;
  provider: string;
  //   [key: string]: any; // Other props
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/member",
  });
  return user;
};

const TestButton = forwardRef<HTMLButtonElement, SocialButtonProps>(
  ({ label, provider, ...props }, ref) => (
    <Form action={`/auth/${provider}`} method="post">
      <Button {...props} ref={ref}>
        {label}
      </Button>
    </Form>
  )
);

const SocialButton: React.FC<SocialButtonProps> = ({ provider, label }) => (
  <Form action={`/auth/${provider}`} method="post">
    <Button>{label}</Button>
  </Form>
);

//   const SocialButton = forwardRef<HTMLButtonElement, SocialButtonProps>(
// 	({ label, provider, ...otherProps }, ref) => (
// 	  <Form action={`/auth/${provider}`} method="post" className="">
// 		<button {...otherProps} ref={ref}>
// 		  {label}
// 		</button>
// 	  </Form>
// 	)
//   );

export default function Login() {
  return (
    <Container size="1">
      <Section>
        <Card variant="classic" size="4">
          <Box height="40px" mb="4">
            <Heading as="h3" size="5" mt="-1">
              <Box>Sign In</Box>
            </Heading>
          </Box>

          <SocialButton
            provider={SocialsProvider.DISCORD}
            label="Login with Discord"
          />
          <SocialButton
            provider={SocialsProvider.GOOGLE}
            label="Login with Google"
          />
        </Card>
      </Section>
    </Container>
  );
}
