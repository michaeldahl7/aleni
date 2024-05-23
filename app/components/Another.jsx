<Flex direction="column" mx={{ initial: "-5", xs: "-6", sm: "0" }}>
  <Flex
    justify="center"
    position="relative"
    px="5"
    py={{ initial: "7", xs: "9" }}
  >
    <Flex
      align="center"
      justify="center"
      overflow="hidden"
      position="absolute"
      inset="0"
    >
      <ThemesPanelBackgroundImage
        id="1"
        width="900"
        height="200%"
        style={{ opacity: 0.5 }}
      />
    </Flex>

    <Box width="100%" maxWidth="400px">
      <Card size="4">
        <Heading as="h3" size="6" trim="start" mb="4">
          Sign up
        </Heading>

        <Box mb="5">
          <label>
            <Text as="div" size="2" weight="bold" mb="1">
              Email address
            </Text>
            <TextField.Root placeholder="Enter your email" />
          </label>
        </Box>

        <Box mb="5" position="relative">
          <Flex align="baseline" justify="between" mb="1">
            <Text as="label" size="2" weight="medium" htmlFor={passwordFieldId}>
              Password
            </Text>
            <Link href="#" size="2">
              Forgot password?
            </Link>
          </Flex>
          <TextField.Root
            id={passwordFieldId}
            placeholder="Enter your password"
          />
        </Box>

        <Flex
          direction={{ initial: "column-reverse", sm: "row" }}
          mt="5"
          justify="end"
          gap="3"
        >
          <Button variant="soft">Create account</Button>
          <Button>Sign in</Button>
        </Flex>
      </Card>
    </Box>
  </Flex>
</Flex>;
