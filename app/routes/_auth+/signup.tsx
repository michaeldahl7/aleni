import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { Button, TextField, Box, Em, Text, Grid } from "@radix-ui/themes";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const errors: { email: string; password: string } = {
    email: "",
    password: "",
  };

  if (!email.includes("@")) {
    errors.email = "Invalid email";
  }

  if (password.length < 12) {
    errors.password = "Password should be at least 12 characters";
  }

  if (Object.values(errors).some((error) => error !== "")) {
    console.log("Errors found:", errors);
    return json({ errors });
  }

  console.log("Signup successful");
  return redirect("/");
}

export default function Dashboard() {
  const actionData = useActionData<typeof action>();

  return (
    <Box width="320px" height="320px">
      <Form method="post">
        <Grid columns="2" gap="2" width="auto">
          <TextField.Root name="email" type="email" placeholder="Email" />
          <Text color="red">
            {actionData?.errors.email ? (
              <Em> {actionData.errors?.email} </Em>
            ) : null}
          </Text>

          <TextField.Root
            name="password"
            type="password"
            placeholder="Password"
          />
          <Text color="red">
            {actionData?.errors.password ? (
              <Em> {actionData.errors?.password} </Em>
            ) : null}
          </Text>
        </Grid>

        <Button type="submit" mt="2">
          Sign Up
        </Button>
      </Form>
    </Box>
  );
}
