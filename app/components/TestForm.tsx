import {
  Theme,
  Container,
  Section,
  Card,
  Text,
  Box,
  Button,
  Flex,
  Link,
  ThemePanel,
  Heading,
  TextField,
  Skeleton,
} from "@radix-ui/themes";

<Container size="1">
  <Section>
    <Card asChild variant="classic" size="4">
      <form action="/">
        <Box height="40px" mb="4">
          <Heading as="h3" size="6" mt="-1">
            <Box>Sign up</Box>
          </Heading>
        </Box>

        <Box mb="5">
          <Flex direction="column">
            <Text as="label" size="2" weight="medium" mb="2" htmlFor="email">
              <Box>Email address</Box>
            </Text>
            <Box>
              <TextField.Root
                id="email"
                type="email"
                variant="classic"
                placeholder="Enter your email"
              />
            </Box>
          </Flex>
        </Box>

        <Box mb="5" position="relative">
          <Box position="absolute" top="0" right="0" style={{ marginTop: -2 }}>
            <Link href="#" size="2">
              <Box>Forgot password?</Box>
            </Link>
          </Box>

          <Flex direction="column">
            <Text as="label" size="2" weight="medium" mb="2" htmlFor="password">
              <Box>Password</Box>
            </Text>
            <Box>
              <TextField.Root
                id="password"
                variant="classic"
                type="password"
                placeholder="Enter your password"
              />
            </Box>
          </Flex>
        </Box>

        <Flex mt="6" justify="end" gap="3">
          <Box>
            <Button variant="surface" highContrast color="gray">
              Create an account
            </Button>
          </Box>
          <Box>
            <Button variant="solid" type="submit">
              Sign in
            </Button>
          </Box>
        </Flex>
      </form>
    </Card>
  </Section>
</Container>;
