import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import invariant from "tiny-invariant";
import {
  unstable_defineLoader as defineLoader,
  unstable_defineAction as defineAction,
  redirect,
  json,
} from "@remix-run/node";
import { Link, useLoaderData, Form, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Dumbbell } from "lucide-react";
import { commitSession, getSession } from "~/utils/session.server";
import { CheckboxField, ErrorList, Field } from "~/components/Forms";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import {
  conformZodMessage,
  getZodConstraint,
  parseWithZod,
} from "@conform-to/zod";
import { z } from "zod";
import { createUsername, isUsernameTaken } from "~/db/user.server";
import { UsernameSchema } from "~/utils/user-validation";
import { useEffect } from "react";
import posthog from "posthog-js";

const CreateUsernameSchema = z.object({
  username: UsernameSchema,
  agreeToTermsOfServiceAndPrivacyPolicy: z.boolean({
    required_error: "You must agree to the terms of service and privacy policy",
  }),
});

// const submission = await parseWithZod(formData, {
// 	schema: SignupFormSchema.superRefine(async (data, ctx) => {
// 		const existingUser = await prisma.user.findUnique({
// 			where: { username: data.username },
// 			select: { id: true },
// 		})
// 		if (existingUser) {
// 			ctx.addIssue({
// 				path: ['username'],
// 				code: z.ZodIssueCode.custom,
// 				message: 'A user already exists with this username',
// 			})
// 			return
// 		}
// 	}).transform(async (data) => {
// 		const session = await signupWithConnection({
// 			...data,
// 			email,
// 			providerId,
// 			providerName,
// 		})
// 		return { ...data, session }
// 	}),
// 	async: true,
// })

// const submission = await parseWithZod(formData, {
// 	schema: SignupSchema.superRefine(async (data, ctx) => {
// const existingUsername = await isUsernameTaken(username);

// 		if (existingUsername) {
// 			ctx.addIssue({
// 				path: ['email'],
// 				code: z.ZodIssueCode.custom,
// 				message: 'A user already exists with this email',
// 			})
// 			return
// 		}
// 	}),
// 	async: true,
// })

// function createSchema(options?: {
//   isUsernameUnique: (username: string) => Promise<boolean>;
// }) {
//   return z.object({
//     username: z
//       .string()
//       .min(3, "Username must be at least 3 characters long")
//       .pipe(
//         z.string().superRefine((username, ctx) => {
//           if (typeof options?.isUsernameUnique !== "function") {
//             ctx.addIssue({
//               code: "custom",
//               message: conformZodMessage.VALIDATION_UNDEFINED,
//               fatal: true,
//             });
//             return;
//           }

//           return options.isUsernameUnique(username).then((isUnique) => {
//             if (!isUnique) {
//               ctx.addIssue({
//                 code: "custom",
//                 message: "Username is already taken",
//               });
//             }
//           });
//         })
//       ),
//     agreeToTermsOfServiceAndPrivacyPolicy: z.boolean({
//       required_error:
//         "You must agree to the terms of service and privacy policy",
//     }),
//   });
// }

export const loader = defineLoader(async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (user && user.username) {
    throw redirect(`/${user.username}/home`);
  }
  return { user };
  //   let session = await getSession(request.headers.get("cookie"));
  //   let error = session.get(authenticator.sessionErrorKey);
  //   return json(
  //     { error, user },
  //     {
  //       headers: {
  //         "Set-Cookie": await commitSession(session), // You must commit the session whenever you read a flash
  //       },
  //     }
  //   );
});

export const action = defineAction(async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);

  invariant(user, "User not found");

  const formData = await request.formData();

  console.log("doing submissions");
  const submission = await parseWithZod(formData, {
    schema: CreateUsernameSchema.superRefine(async (data, ctx) => {
      const existingUsername = await isUsernameTaken(data.username);
      if (existingUsername) {
        ctx.addIssue({
          path: ["username"],
          code: z.ZodIssueCode.custom,
          message: "A user already exists with this username",
        });
        return;
      }
    }),
    async: true,
  });
  console.log("submission done");
  //   const submission = await parseWithZod(formData, {
  //     schema: createSchema({
  //       async isUsernameUnique(username) {
  //         const user = await isUsernameTaken(username);
  //         return !user;
  //       },
  //     }),

  //   });

  if (submission.status !== "success") {
    return json(
      { result: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 }
    );
  }
  const username = submission.value.username;

  const updatedUser = await createUsername(user.id, username);

  if (!updatedUser) {
    return json({
      result: submission.reply({
        formErrors: ["Failed to create username. Please try again later."],
      }),
    });
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set(authenticator.sessionKey, {
    ...user,
    username: username,
  });

  return redirect(`/${username}/home`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
});

export const meta: MetaFunction = () => {
  return [{ title: "Webapp" }, { name: "description", content: "Welcome" }];
};

export default function IndexRoute() {
  const { user } = useLoaderData<typeof loader>();
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  useEffect(() => {
    if (user) {
      if (
        posthog.get_distinct_id() &&
        posthog.get_distinct_id() !== user.email
      ) {
        posthog.identify(user.email);
      }
    }
  }, [user]);
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    id: "login-form",
    constraint: getZodConstraint(CreateUsernameSchema),
    lastResult: actionData?.result,
    onValidate({ formData }) {
      //   console.log("Hello", form.errors);
      return parseWithZod(formData, {
        schema: CreateUsernameSchema,
      });
    },
    // shouldValidate: "onBlur",
    shouldRevalidate: "onBlur",
  });

  return (
    <div className="flex items-center flex-col justify-center h-screen">
      <div className="w-80 h-[20rem] flex flex-col items-center">
        <Dumbbell size={48} strokeWidth={1} className="mb-4" />
        <div className="font-semibold text-2xl mb-9">Welcome to Aleni</div>
        {!user ? (
          <div className="flex flex-col items-center w-full gap-3 text-sm">
            <Button className="w-2/4" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button className="w-2/4" asChild>
              <Link to="/signup">Signup</Link>
            </Button>

            {/* {error && <div className="text-destructive">{error.message}</div>} */}
          </div>
        ) : (
          <Form method="post" {...getFormProps(form)} className="grid gap-1">
            <button type="submit" className="hidden" />
            <Field
              labelProps={{ htmlFor: fields.username.id, children: "Username" }}
              inputProps={{
                ...getInputProps(fields.username, { type: "text" }),
              }}
              errors={fields.username.errors}
            />
            <div className="min-h-[32px] px-4 pb-1 pt-1">
              {fields.username.errors ? (
                <div className="text-[14px] text-destructive">
                  {fields.username.errors}
                </div>
              ) : null}
            </div>
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
            <ErrorList id={form.errorId} errors={form.errors} />
          </Form>
        )}
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.data}</p>
        <p>The stack trace is:</p>
        <pre>{error.status}</pre>
        <pre>{error.statusText}</pre>
      </div>
    );
  }
  return <div />;
}
