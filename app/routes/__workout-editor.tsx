import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
// import { Label } from "~/components/ui/label";
// import { Separator } from "~/components/ui/separator";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import {
  Form,
  useActionData,
  useNavigate,
} from "@remix-run/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import DropDownDelete from "~/components/DropDownDelete";

import { ErrorList, Field } from "~/components/Forms";
import { PlusIcon, Cross1Icon } from "@radix-ui/react-icons";
import { GeneralErrorBoundary } from "~/components/ErrorBoundary";

import { Workout } from "~/db/workout.server";

import { type action } from "~/utils/__workout-editor.server";

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

export const workoutSchema = z.object({
  userId: z.string(),
  title: z.string().optional(),
  //   title: z.string({ required_error: "Please provide a workout title" }),
  activities: z
    .array(activitySchema)
    .nonempty({ message: "Please provide at least one activity" }),
});

export const createEmptyActivity = () => ({
  name: "",
  sets: [
    { reps: "", weight: "" },
    { reps: "", weight: "" },
    { reps: "", weight: "" },
  ],
});

// export const loader = defineLoader(async ({ request }) => {
//   const user: UserSelect = await authenticator.isAuthenticated(request, {
//     failureRedirect: "/login",
//   });
//   const activities = [createEmptyActivity()];
//   return { title: "", activities, user };
// });

// export const action = defineAction(async ({ request }) => {
//   const { user } = useLoaderData<typeof loader>();
//   const formData = await request.formData();
//   const submission = parseWithZod(formData, {
//     schema: workoutSchema,
//   });

//   if (submission.status !== "success") {
//     return json(submission.reply());
//   }
//   const workout = await createWorkout(
//     submission.value.userId,
//     submission.value.activities,
//     submission.value.title
//   );

//   if (!workout) {
//     return json(
//       submission.reply({
//         formErrors: ["Failed to create workout. Please try again later."],
//       })
//     );
//   }
//   throw redirect(`${user.username}/workouts/${workout.id}`);
// });

export function WorkoutEditor({
  workout,
  userId,
}: {
  workout?: Workout;
  userId: string;
}) {
  const navigate = useNavigate();
  const lastResult = useActionData<typeof action>();
  //   const { activities, user } = useLoaderData<typeof loader>();

  const [form, fields] = useForm({
    id: "workout-form",
    lastResult,
    constraint: getZodConstraint(workoutSchema),
    defaultValue: {
      ...workout,
    },

    onValidate({ formData }) {
      const parseResult = parseWithZod(formData, { schema: workoutSchema });
     
      console.log("parseResult", parseResult);
      return parseResult;
    },

    shouldValidate: "onBlur",
  });
  const activitiesFields = fields.activities.getFieldList();
  return (
    <div className="absolute flex flex-col inset-0">
      <Form
        method="post"
        {...getFormProps(form)}
        className="overflow-y-auto overflow-x-hidden px-10 pb-28 pt-12"
      >
        <button type="submit" className="hidden" />
        <Input
          type="hidden"
          name="userId"
          value={userId}
          className="visually-hidden"
        />
        <Card className=" mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle>Create workout</CardTitle>
            <CardDescription>
              Give your workout a title such as legs, back, chest, etc.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-1">
            <Field
              labelProps={{ htmlFor: fields.title.id, children: "Title" }}
              inputProps={{
                ...getInputProps(fields.title, { type: "text" }),
              }}
              errors={fields.title.errors}
            />

            {activitiesFields.map((activity, activityIndex) => {
              const activityFields = activity.getFieldset();
              const setsFields = activityFields.sets.getFieldList();
              return (
                <Card key={activity.key}>
                  <CardHeader>
                    <CardTitle>
                      <div className="flex justify-between relative">
                        Activity
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-0 top-0 "
                          {...form.remove.getButtonProps({
                            name: fields.activities.name,
                            index: activityIndex,
                          })}
                        >
                          <div className="inline-flex items-center ">
                            <Cross1Icon />
                          </div>
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Enter in the activty you did, such as squat, lunge,
                      deadlift and then add the reps and weight for each set.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <Field
                      labelProps={{
                        // htmlFor: activityFields.name.name,
                        children: "Name",
                      }}
                      inputProps={{
                        name: activityFields.name.name,
                        id: activityFields.name.id,
                        placeholder: "",
                      }}
                      errors={activityFields.name.errors}
                      className="grid gap-2 flex-grow"
                    />

                    {setsFields.map((set, setIndex) => {
                      const setFields = set.getFieldset();
                      return (
                        <div
                          key={set.key}
                          className="grid grid-cols-[1fr_1fr_auto] gap-3"
                        >
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
                            className="grid  gap-2"
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
                            className="grid  gap-2"
                          />
                          <div className="grid gap-2">
                            <Button
                              variant="destructive"
                              size="icon"
                              className="self-center -mt-4"
                              {...form.remove.getButtonProps({
                                name: `${fields.activities.name}[${activityIndex}].sets`,
                                index: setIndex,
                              })}
                            >
                              <div className="inline-flex items-center ">
                                <Cross1Icon />
                              </div>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                  <CardFooter className="place-content-center">
                    <Button
                      variant="secondary"
                      {...form.insert.getButtonProps({
                        name: `${fields.activities.name}[${activityIndex}].sets`,
                      })}
                    >
                      <div className="inline-flex items-center gap-2">
                        <PlusIcon />
                        Set
                      </div>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}

            <Button
              variant="secondary"
              {...form.insert.getButtonProps({
                name: fields.activities.name,
                defaultValue: createEmptyActivity(),
              })}
            >
              <div className="inline-flex items-center gap-2">
                <PlusIcon />
                Activity
              </div>
            </Button>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button variant="outline" {...form.reset.getButtonProps()}>
              Reset
            </Button>
            <Button type="submit">Submit</Button>
          </CardFooter>
        </Card>
        <ErrorList id={form.errorId} errors={form.errors} />
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: ({ params }) => (
          <p>No workout with the id {params.workoutId} exists</p>
        ),
      }}
    />
  );
}
