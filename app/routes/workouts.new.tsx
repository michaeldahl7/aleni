import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { createWorkout } from "~/db/workout.server";
import { authenticator } from "~/utils/auth.server";
import { useNavigate } from "@remix-run/react";

import {
  unstable_defineLoader as defineLoader,
  unstable_defineAction as defineAction,
  json,
  redirect,
} from "@remix-run/node";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DropDownDelete from "~/components/DropDownDelete";

import { UserSelect } from "~/db/schema.server";
import { Field } from "~/components/Forms";

const setSchema = z.object({
  reps: z.number({ required_error: "Reps are required" }).min(1),
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
  name: z.string().optional(),
  //   title: z.string({ required_error: "Please provide a workout title" }),
  activities: z
    .array(activitySchema)
    .nonempty({ message: "Please provide at least one activity" }),
});

const createEmptyActivity = () => ({
  name: "",
  sets: [
    { reps: "", weight: "" },
    { reps: "", weight: "" },
  ],
});

export const loader = defineLoader(async ({ request }) => {
  const user: UserSelect = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const activities = [createEmptyActivity()];
  return { name: "Workout", activities, user };
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
    submission.value.activities,
    submission.value.name
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

export default function WorkoutForm() {
  const navigate = useNavigate();
  const { name, activities, user } = useLoaderData<typeof loader>();

  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    defaultValue: {
      name,
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
      <Input
        type="hidden"
        name="userId"
        value={user.id}
        className="visually-hidden"
      />
      <Card className="w-[640px] mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl">Create workout</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <Field
            labelProps={{ htmlFor: "workoutName", children: "Workout Name" }}
            inputProps={{
              id: "workoutName",
              placeholder: "Legs, Back, Chest, etc.",
            }}
            className="grid gap-2"
          />
          <div>
            {activitiesFields.map((activity, activityIndex) => {
              const activityFields = activity.getFieldset();
              const setsFields = activityFields.sets.getFieldList();
              return (
                <div
                  key={activity.key}
                  className="overflow-hidden rounded-[0.5rem] border bg-background shadow p-4 mt-4"
                >
                  <div className="flex justify-between">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                      Activity
                    </h3>
                    <DropDownDelete />
                  </div>
                  <Field
                    labelProps={{
                      htmlFor: activityFields.name.name,
                    }}
                    inputProps={{
                      name: activityFields.name.name,
                      id: "4",
                      placeholder: "Squat",
                    }}
                    errors={activityFields.name.errors}
                    className="grid gap-2 flex-grow"
                  />
                  <div>
                    {setsFields.map((set, setIndex) => {
                      const setFields = set.getFieldset();
                      return (
                        <div key={set.key}>
                          <div className="grid grid-cols-5 gap-4">
                            <Field
                              labelProps={{
                                htmlFor: setFields.reps.name,
                                children: "Reps",
                              }}
                              inputProps={{
                                name: setFields.reps.name,
                                id: setFields.reps.name,
                                placeholder: "10",
                              }}
                              errors={setFields.reps.errors}
                              className="grid col-span-2 gap-2"
                            />

                            <Field
                              labelProps={{
                                htmlFor: setFields.weight.name,
                                children: "Weight",
                              }}
                              inputProps={{
                                id: setFields.weight.name,
                                placeholder: "120",
                              }}
                              errors={setFields.weight.errors}
                              className="grid col-span-2 gap-2"
                            />
                            <div className="grid gap-2 ">
                              <Button
                                variant="destructive"
                                className="self-center -mt-4"
                                {...form.remove.getButtonProps({
                                  name: `${fields.activities.name}[${activityIndex}].sets`,
                                  index: setIndex,
                                })}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between ">
                    <Button
                      variant="secondary"
                      {...form.insert.getButtonProps({
                        name: `${fields.activities.name}[${activityIndex}].sets`,
                      })}
                    >
                      Add Set
                    </Button>
                    <Button
                      variant="secondary"
                      {...form.remove.getButtonProps({
                        name: fields.activities.name,
                        index: activityIndex,
                      })}
                    >
                      Remove activity
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            variant="secondary"
            {...form.insert.getButtonProps({
              name: fields.activities.name,
              defaultValue: createEmptyActivity(),
            })}
          >
            Add Activity
          </Button>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="outline" type="reset">
            Reset
          </Button>
          <Button type="submit">Submit</Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
