import { Link } from "@remix-run/react";
import {
  Link as RadixLink,
  Box,
  Container,
  Section,
  Card,
  Heading,
  Flex,
} from "@radix-ui/themes";

export function loader() {
  return new Response("Not Found", {
    status: 404,
  });
}

export default function NotFoundPage() {
  return (
    <Container size="1">
      <Section size="2">
        <Card>
          <Heading size="6" align="center">
            OOPS! Page not found.
          </Heading>
          <Flex align="center" justify="center" mt="4">
            <RadixLink asChild size="5" weight="bold">
              <Link to="/workouts">Go home</Link>
            </RadixLink>
          </Flex>
        </Card>
      </Section>
    </Container>
  );
}
