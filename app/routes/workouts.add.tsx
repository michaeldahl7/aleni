import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { createWorkout } from "~/db/workout.server";
import { authenticator } from "~/utils/auth.server";
import {
  unstable_defineLoader as defineLoader,
  unstable_defineAction as defineAction,
  json,
  redirect,
} from "@remix-run/node";

import { UserSelect } from "~/db/schema.server";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define subschemas
const setSchema = z.object({
  reps: z.number({ required_error: "Please provide a number of reps" }).min(1),
  weight: z.string().optional(),
});

const activitySchema = z.object({
  name: z.string({ required_error: "Please provide a name" }).min(1),
  sets: z
    .array(setSchema)
    .nonempty({ message: "Please provide at least one set" }),
});

const workoutSchema = z.object({
  userId: z.number(),
  title: z.string({ required_error: "Please provide a workout title" }),
  activities: z
    .array(activitySchema)
    .nonempty({ message: "Please provide at least one activity" }),
});

const createEmptyActivity = () => ({
  name: "",
  sets: [{ reps: "", weight: "" }],
});

export const loader = defineLoader(async ({ request }) => {
  const user: UserSelect = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const activities = [createEmptyActivity()];
  return { title: "Workout", activities, user };
});

export const action = defineAction(async ({ request }) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: workoutSchema,
  });

  if (submission.status !== "success") {
    return json(submission.reply());
  }
  const workout = await createWorkout(
    submission.value.userId,
    submission.value.title,
    submission.value.activities
  );

  if (!workout) {
    console.log("failed to create workout");
    return json(
      submission.reply({
        formErrors: ["Failed to create workout. Please try again later."],
      })
    );
  }
  throw redirect("/workouts");
});

export default function Login() {
  const { title, activities, user } = useLoaderData<typeof loader>();

  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    defaultValue: {
      title,
      activities,
    },

    onValidate({ formData }) {
      const parseResult = parseWithZod(formData, { schema: workoutSchema });
      //LOG THE VALIDATION RESULT client side
      console.log("parseResult", parseResult);
      return parseResult;
    },

    shouldValidate: "onBlur",
  });
  const activitiesFields = fields.activities.getFieldList();

  return (
    <Form method="post" {...getFormProps(form)}>
      <Card className="w-[500px] mx-auto">
        <CardHeader>
          <CardTitle>Create workout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-2">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Workout Name</Label>
              <Input id="name" placeholder="Legs, Back, Chest, etc." />
            </div>
            <div>
              <Input
                type="hidden"
                name="userId"
                value={user.id}
                className="visually-hidden"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              {activitiesFields.map((activity, activityIndex) => {
                const activityFields = activity.getFieldset();
                const setsFields = activityFields.sets.getFieldList();
                return (
                  <>
                    <div
                      key={activity.id}
                      className="flex flex-col space-y-1.5"
                    >
                      <div className="flex justify-between">
                        <Label htmlFor="name">Activity</Label>
                        {activityFields.name.errors && (
                          <Label className="text-destructive">
                            {activityFields.name.errors}
                          </Label>
                        )}
                      </div>
                      <Input
                        id={activityFields.name.name}
                        name={activityFields.name.name}
                        placeholder="Sqauat"
                      />
                    </div>
                    <div>
                      {setsFields.map((set, setIndex) => {
                        const setFields = set.getFieldset();
                        return (
                          <div key={set.id}>
                            <div className="flex  space-y-1.5">
                              <div className="flex flex-col align-baseline justify-between">
                                <Label htmlFor="reps">Reps</Label>
                                {setFields.reps.errors && (
                                  <Label className="text-destructive">
                                    {setFields.reps.errors}
                                  </Label>
                                )}
                              </div>
                              <Input
                                id={setFields.reps.name}
                                name={setFields.reps.name}
                                type="number"
                                placeholder="10"
                              />
                              <div className="flex align-baseline justify-between">
                                <Label htmlFor="weight">Weight</Label>
                                {setFields.weight.errors && (
                                  <Label className="text-destructive">
                                    {setFields.weight.errors}
                                  </Label>
                                )}
                              </div>
                              <Input
                                id={setFields.weight.name}
                                name={setFields.weight.name}
                                type="number"
                                placeholder="120"
                              />

                              <Button
                                {...form.remove.getButtonProps({
                                  name: `${fields.activities.name}[${activityIndex}].sets`,
                                  index: setIndex,
                                })}
                              >
                                Remove set
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Button
                      {...form.insert.getButtonProps({
                        name: `${fields.activities.name}[${activityIndex}].sets`,
                      })}
                    >
                      Add set
                    </Button>
                    <Button
                      {...form.remove.getButtonProps({
                        name: fields.activities.name,
                        index: activityIndex,
                      })}
                    >
                      Remove activity
                    </Button>
                  </>
                );
              })}
            </div>
            <Button
              {...form.insert.getButtonProps({
                name: fields.activities.name,
                defaultValue: createEmptyActivity(),
              })}
            >
              Add activity
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Submit</Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
