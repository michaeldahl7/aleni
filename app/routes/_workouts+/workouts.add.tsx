import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { createWorkout } from "~/db/workout.server";
import { authenticator } from "~/utils/auth.server";
import type { UserSelect, WorkoutInsert } from "~/db/schema.server";

// Define subschemas
const setSchema = z.object({
  reps: z.number({ required_error: "Please provide a number of reps" }).min(1),
  weight: z.string().optional(),
});

const activitySchema = z.object({
  name: z.string({ required_error: "Please provide a name" }).min(1),
  sets: z.array(setSchema),
});

const workoutSchema = z.object({
  userId: z.number(),
  title: z.string({ required_error: "Please provide a workout title" }),
  activities: z.array(activitySchema),
});

// Helper function to create an empty activity with 3 empty sets
const createEmptyActivity = () => ({
  name: "",
  sets: [
    { reps: "", weight: "" },
    { reps: "", weight: "" },
    { reps: "", weight: "" },
  ],
});

// Loader function to fetch initial data
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user: UserSelect = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const activities = [createEmptyActivity()];
  return json({ title: "Workout", activities, user });
};

// Action function to handle form submission
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: workoutSchema });
  console.log("submission", submission);
  if (submission.status !== "success") {
    return json(submission.reply());
  }

  const workout = await createWorkout(
    submission.value.userId,
    submission.value.title,
    submission.value.activities
  );

  console.log(workout);

  if (!workout) {
    console.log("failed to create workout");
    return submission.reply({
      formErrors: ["Failed to create workout. Please try again later."],
    });
  }

  // Handle successful form submission here
  // ...
  return redirect("/workouts"); // Example redirect after successful submission
}

// Main form component
export default function WorkoutForm() {
  // Last submission returned by the server
  const { title, activities, user } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  console.log("lastResult", lastResult);
  const [form, fields] = useForm({
    // Sync the result of last submission
    lastResult,
    defaultValue: {
      title,
      activities,
    },

    // Reuse the validation logic on the client
    onValidate({ formData }) {
      const parse = parseWithZod(formData, { schema: workoutSchema });
      console.log(parse);
      return parseWithZod(formData, { schema: workoutSchema });
    },

    // Validate the form on blur event triggered
    shouldValidate: "onSubmit",
  });

  const activitiesFields = fields.activities.getFieldList();

  return (
    <>
      <h1>Add New Workout</h1>
      <Form method="post" {...getFormProps(form)}>
        <div>{form.errors}</div>
        <input type="hidden" name="userId" value={user.id} />
        <label htmlFor={fields.title.name}>Workout Name</label>
        <input
          id={fields.title.name}
          name={fields.title.name}
          defaultValue={fields.title.value}
        />
        {fields.title.errors && <span>{fields.title.errors}</span>}

        <ul>
          {activitiesFields.map((activity, activityIndex) => {
            const activityFields = activity.getFieldset();
            const setsFields = activityFields.sets.getFieldList();

            return (
              <div key={activity.id}>
                <label htmlFor={activityFields.name.name}>Activity Name</label>
                <input
                  id={activityFields.name.name}
                  name={activityFields.name.name}
                />
                {activityFields.name.errors && (
                  <span>{activityFields.name.errors}</span>
                )}

                <ul>
                  {setsFields.map((set, setIndex) => {
                    const setFields = set.getFieldset();
                    return (
                      <div key={set.id}>
                        <label htmlFor={setFields.reps.name}>Reps</label>
                        <input
                          id={setFields.reps.name}
                          name={setFields.reps.name}
                        />
                        {setFields.reps.errors && (
                          <span>{setFields.reps.errors}</span>
                        )}
                        <label htmlFor={setFields.weight.name}>Weight</label>
                        <input
                          id={setFields.weight.name}
                          name={setFields.weight.name}
                        />
                        {setFields.weight.errors && (
                          <span>{setFields.weight.errors}</span>
                        )}
                        <button
                          {...form.remove.getButtonProps({
                            name: `${fields.activities.name}[${activityIndex}].sets`,
                            index: setIndex,
                          })}
                        >
                          Remove set
                        </button>
                      </div>
                    );
                  })}
                </ul>
                <button
                  {...form.insert.getButtonProps({
                    name: `${fields.activities.name}[${activityIndex}].sets`,
                  })}
                >
                  Add set
                </button>
                <button
                  {...form.remove.getButtonProps({
                    name: fields.activities.name,
                    index: activityIndex,
                  })}
                >
                  Remove activity
                </button>
              </div>
            );
          })}
        </ul>
        <button
          {...form.insert.getButtonProps({
            name: fields.activities.name,
            defaultValue: createEmptyActivity(),
          })}
        >
          Add activity
        </button>
        <button type="submit">Submit</button>
      </Form>
    </>
  );
}
