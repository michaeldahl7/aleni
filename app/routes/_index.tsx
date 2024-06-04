import type { MetaFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import invariant from "tiny-invariant";
import {
  unstable_defineLoader as defineLoader,
  unstable_defineAction as defineAction,
  redirect,
  json,
} from "@remix-run/node";
import {
  Link,
  useLoaderData,
  Form,
  useActionData,
  useFetcher,
} from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Dumbbell } from "lucide-react";
import { commitSession, getSession } from "~/utils/session.server";
import { CheckboxField, Field } from "~/components/Forms";
import { conformZodMessage } from "@conform-to/zod";
import {
  FormProvider,
  getFieldsetProps,
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
  type FieldMetadata,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import {
  createUsername,
  getUserByUsername,
  isUsernameTaken,
} from "~/db/user.server";

const usernameSchema = z.object({
  username: z.string(),
});

function createSchema(options?: {
  isUsernameUnique: (username: string) => Promise<boolean>;
}) {
  return z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .pipe(
        z.string().superRefine((username, ctx) => {
          if (typeof options?.isUsernameUnique !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }

          return options.isUsernameUnique(username).then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: "custom",
                message: "Username is already taken",
              });
            }
          });
        })
      ),
    agreeToTermsOfServiceAndPrivacyPolicy: z.boolean({
      required_error:
        "You must agree to the terms of service and privacy policy",
    }),
  });
}

export const loader = defineLoader(async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);

  if (user && user.username) {
    throw redirect(`/${user.username}`);
  }
  return user;
});

export const action = defineAction(async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  invariant(user, "User must exist");

  const formData = await request.formData();
  const submission = await parseWithZod(formData, {
    schema: createSchema({
      async isUsernameUnique(username) {
        // Implement your logic to check if the username is unique
        // For example, query your database to see if the username exists
        const user = await isUsernameTaken(username);
        return !user;
      },
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  const updatedUser = await createUsername(user.id, submission.value.username);

  if (!updatedUser) {
    return json(
      submission.reply({
        formErrors: ["Failed to create username. Please try again later."],
      })
    );
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set(authenticator.sessionKey, {
    ...user,
    username: submission.value.username,
  });

  return redirect(`/${submission.value.username}`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
});

export const meta: MetaFunction = () => {
  return [{ title: "Webapp" }, { name: "description", content: "Welcome" }];
};

export default function IndexRoute() {
  const user = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: createSchema(),
      });
    },
    shouldValidate: "onBlur",
  });

  return (
    <div className="flex items-center flex-col justify-center h-screen">
      <div className="w-80 h-[20rem] flex flex-col items-center">
        <Dumbbell size={48} strokeWidth={1} className="mb-4" />
        <div className="font-semibold text-2xl mb-9">Welcome to Member</div>
        {!user ? (
          <div className="flex flex-col items-center w-full gap-3 text-sm">
            <Button className="w-2/4" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button className="w-2/4" asChild>
              <Link to="/signup">Signup</Link>
            </Button>
          </div>
        ) : (
          <Form method="post" {...getFormProps(form)} className="grid gap-2">
            <Field
              labelProps={{ htmlFor: fields.username.id, children: "Username" }}
              inputProps={{
                ...getInputProps(fields.username, { type: "text" }),
              }}
              errors={fields.username.errors}
            />
            <CheckboxField
              labelProps={{
                htmlFor: fields.agreeToTermsOfServiceAndPrivacyPolicy.id,
                children:
                  "Do you agree to our Terms of Service and Privacy Policy?",
              }}
              buttonProps={getInputProps(
                fields.agreeToTermsOfServiceAndPrivacyPolicy,
                { type: "checkbox" }
              )}
              errors={fields.agreeToTermsOfServiceAndPrivacyPolicy.errors}
            />
            <Button type="submit">Create Username</Button>
          </Form>
        )}
      </div>
    </div>
  );
}
