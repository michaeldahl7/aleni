import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useActionData } from "@remix-run/react"; // Ensure to import your database connection
// import { workouts, activities, sets } from "~/db/schema.server"; // Ensure to import your models
import Activity from "~/components/Activity";
import { authenticator } from "~/utils/auth.server";
import { createWorkoutWithDetails } from "~/db/workout.server";
// import type { Workout } from "~/db/workout.server";
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";

// Define a schema for your form
const schema = z.object({
  title: z.string().optional(),
  activities: z.array(
    z.object({
      name: z.string().min(1, "Activity name is required"),
      sets: z.array(
        z.object({
          reps: z.string().min(1,"Reps are required"),
          weight: z.string().optional(),
        })
      ).nonempty("At least one set is required")
    })
  ).nonempty("At least one activity is required")
});


export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });
  console.log("submission", submission);

  if (submission.status !== 'success') {
    return json(submission.reply());
  }

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const title = formData.get("title")?.toString() || "My Workout";

  const activityData = [];
  const activityNames = formData.getAll("activity-name[]");

  for (let index = 0; index < activityNames.length; index++) {
    const name = activityNames[index].toString();
    const setCount = parseInt(formData.get(`set-count-${index}`) as string, 10);
    const sets = [];
    for (let i = 0; i < setCount; i++) {
      sets.push({
        reps: parseInt(formData.get(`reps-${index}-${i}`) as string, 10),
        weight: formData.get(`weight-${index}-${i}`) as string,
      });
    }
    activityData.push({ name, sets });
  }

  const workoutCreated = await createWorkoutWithDetails(user.id, title, activityData);

  // if (!workoutCreated) {
  //   return json({ error: "Failed to create workout" }, { status: 500 });
  // }

  return redirect("/workouts");
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return json({ user });
};

export default function NewWorkout() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    // Sync the result of last submission
    lastResult,

    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },

    // Validate the form on blur event triggered
    shouldValidate: 'onBlur',
  });

  const activityFields = fields.activities.getFieldList()
  // const { user } = useLoaderData<typeof loader>();
  const [activities, setActivities] = useState([{ name: "", sets: [{ reps: "", weight: "" }] }]);

  const addActivity = () => {
    setActivities([...activities, { name: "", sets: [{ reps: "", weight: "" }] }]);
  };

  const addSet = (activityIndex: number) => {
    const newActivities = [...activities];
    newActivities[activityIndex].sets.push({ reps: "", weight: "" });
    setActivities(newActivities);
  };

  const handleActivityChange = (index: number, value: string) => {
    const newActivities = [...activities];
    newActivities[index].name = value;
    setActivities(newActivities);
  };

  const handleSetChange = (activityIndex: number, setIndex: number, field: string, value: string) => {
    const newActivities = [...activities];
    newActivities[activityIndex].sets[setIndex][field] = value;
    setActivities(newActivities);
  };

  return (
    <div>
      <h1>Add New Workout</h1>
      <Form method="post" id={form.id} onSubmit={form.onSubmit}>
        <div>{form.errors}</div>
      <div>
        <label>
          Workout Name (optional):
          <input type="text" name="title" placeholder="Enter workout name" />
        </label>
      </div>
      <fieldset>
        <legend>Activities</legend>
        {activities.map((activity, activityIndex) => (
          <div key={activityIndex}>
            <label>
              Activity Name:
              <input
                type="text"
                name={`activity-name[]`}
                value={activity.name}
                onChange={(e) => handleActivityChange(activityIndex, e.target.value)}
                required
              />
            </label>
            {activity.sets.map((set, setIndex) => (
              <div key={setIndex}>
                <label>
                  Reps:
                  <input
                    type="number"
                    name={`reps-${activityIndex}-${setIndex}`}
                    value={set.reps}
                    onChange={(e) => handleSetChange(activityIndex, setIndex, "reps", e.target.value)}
                    required
                  />
                </label>
                <label>
                  Weight (optional):
                  <input
                    type="number"
                    name={`weight-${activityIndex}-${setIndex}`}
                    value={set.weight}
                    onChange={(e) => handleSetChange(activityIndex, setIndex, "weight", e.target.value)}
                  />
                </label>
              </div>
            ))}
            <button type="button" aria-label="Add another set" onClick={() => addSet(activityIndex)}>
              + Add Set
            </button>
            <input type="hidden" name={`set-count-${activityIndex}`} value={activity.sets.length} />
          </div>
        ))}
        <button type="button" aria-label="Add another activity" onClick={addActivity}>
          + Add Activity
        </button>
      </fieldset>
      <button>Submit</button>
    </Form>
    </div>
  );
}
