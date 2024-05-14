  import { useState } from "react";
  import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
  import { json, redirect } from "@remix-run/node";
  import { Form, useLoaderData } from "@remix-run/react"; // Ensure to import your database connection
  // import { workouts, activities, sets } from "~/db/schema.server"; // Ensure to import your models
  import Activity from "~/components/Activity";
  import { authenticator } from "~/utils/auth.server";
  import { createWorkout, createActivity, createSet } from "~/db/workout.server";
  // import type { Workout } from "~/db/workout.server";

  export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    const user = await authenticator.isAuthenticated(request, {
      failureRedirect: "/login",
    });

    const title = formData.get("title")?.toString() || "My Workout"; // Get the title or set a default

    const activityData = [];
    const activityNames = formData.getAll("activity-name[]");

    for (let index = 0; index < activityNames.length; index++) {
      
      const name = activityNames[index].toString();
      console.log("Creating activity", name);
      formData.forEach((value, key) => {
        console.log("Key:", key, "Value:", value)
      });
      const setCount = parseInt(formData.get(`set-count-${index}`) as string, 10);
      console.log("Set Count:", setCount);
      const sets = [];
      for (let i = 0; i < setCount; i++) {
        sets.push({
          reps: parseInt(formData.get(`reps-${index}-${i}`) as string, 10),
          weight: formData.get(`weight-${index}-${i}`) as string,
        });
        console.log("Set", i, ":", sets[i])
      }
      activityData.push({ name, sets });
    }

    console.log("Activity Data:", JSON.stringify(activityData, null, 2));

    const date = new Date();
    const workoutCreated = await createWorkout(user.id!, date, title);

    if (!workoutCreated) {
      return json({ error: "Failed to create workout" }, { status: 500 });
    }

    console.log("Workout Created:", workoutCreated);

    for (let activityIndex = 0; activityIndex < activityData.length; activityIndex++) {
      console.log("Creating activity", activityIndex);
      const activity = activityData[activityIndex];
      console.log("Activity Data:", JSON.stringify(activity, null, 2));

      const activityCreated = await createActivity(workoutCreated.id, activity.name, activityIndex);

      if (!activityCreated) {
        return json({ error: "Failed to create activity" }, { status: 500 });
      }

      console.log("Activity Created:", activityCreated);

      for (let setIndex = 0; setIndex < activity.sets.length; setIndex++) {
        console.log("Creating set", setIndex);
        const set = activity.sets[setIndex];
        console.log("Set Data:", JSON.stringify(set, null, 2));

        await createSet(activityCreated.id, set.reps, set.weight, setIndex);
      }
    }

    return redirect("/workouts");
  };

  export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await authenticator.isAuthenticated(request, {
      failureRedirect: "/login",
    });
    console.log("user", user.email)
    return json({ user });
  };

  export default function NewWorkout() {
    // const { user } = useLoaderData<typeof loader>();
    const [activityInputs, setActivityInputs] = useState([{ name: "", sets: [{ reps: "", weight: "" }] }]);

    const addActivity = () => {
      setActivityInputs([...activityInputs, { name: "", sets: [{ reps: "", weight: "" }] }]);
    };

    const addSet = (activityIndex: number) => {
      const newActivities = [...activityInputs];
      newActivities[activityIndex].sets.push({ reps: "", weight: "" });
      setActivityInputs(newActivities);
    };

    const handleActivityChange = (index: number, value: string) => {
      const newActivities = [...activityInputs];
      newActivities[index].name = value;
      setActivityInputs(newActivities);
    };

    const handleSetChange = (activityIndex: number, setIndex: number, field: string, value: string) => {
      const newActivities = [...activityInputs];
      newActivities[activityIndex].sets[setIndex][field] = value;
      setActivityInputs(newActivities);
    };

    return (
      <div>
        <h1>Add New Workout</h1>
        <Form method="post">
          <div>
            <label>
              Workout Name (optional):
              <input type="text" name="title" placeholder="Enter workout name" />
            </label>
          </div>
          <fieldset>
            <legend>Activities</legend>
            {activityInputs.map((activity, activityIndex) => (
              <div key={activityIndex}>
                <Activity
                  activityIndex={activityIndex}
                  name={activity.name}
                  sets={activity.sets}
                  addSet={addSet}
                  handleActivityChange={handleActivityChange}
                  handleSetChange={handleSetChange}
                />
                <input
                  type="hidden"
                  name={`set-count-${activityIndex}`}
                  value={activity.sets.length}
                />
              </div>
            ))}
            <button type="button" aria-label="Add another activity" onClick={addActivity}>
              + Add Activity
            </button>
          </fieldset>
          <button type="submit">Save Workout</button>
        </Form>
      </div>
    );
  }
