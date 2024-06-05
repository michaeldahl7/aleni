import {
  Container,
  Section,
  Card,
  Button,
  Box,
  Heading,
  Flex,
  Text,
  TextField,
  Grid,
  Separator,
} from "@radix-ui/themes";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import {
  unstable_defineLoader as defineLoader,
  unstable_defineAction as defineAction,
} from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { getWorkoutById, updateWorkout } from "~/db/workout.server";
import { validationWorkoutSchema } from "~/db/schema.server";
import { parseWithZod } from "@conform-to/zod";
import { useForm, getFormProps, getInputProps } from "@conform-to/react";
import { GeneralErrorBoundary } from "~/components/ErrorBoundary";

// Define the loader to fetch workout details for editing
export const loader = defineLoader(async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const workoutId = params.workoutId;
  if (!workoutId) {
    throw new Response("Workout ID not provided", { status: 400 });
  }

  const workout = await getWorkoutById(Number(workoutId), user.id);
  if (!workout) {
    throw new Response("Workout not found", { status: 404 });
  }

  return workout;
});

// Define the action to handle form submission for updates
export async function action({ request, params }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const workoutId = params.workoutId;
  if (!workoutId) {
    throw new Response("Workout ID not provided", { status: 400 });
  }

  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: validationWorkoutSchema,
  });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  const updatedWorkout = await updateWorkout(
    Number(workoutId),
    submission.value
  );

  if (!updatedWorkout) {
    return submission.reply({
      formErrors: ["Failed to update workout. Please try again later."],
    });
  }

  return redirect(`/workouts/${workoutId}`);
}

export default function EditWorkout() {
  const workout = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult,
    defaultValue: {
      title: workout.title,
      activities: workout.activities,
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: validationWorkoutSchema });
    },
    shouldValidate: "onSubmit",
  });

  const activitiesFields = fields.activities.getFieldList();

  return (
    <Container size="2">
      <Section size="2">
        <Card asChild variant="classic" size="4">
          <Form method="post" {...getFormProps(form)}>
            <Flex height="40px" mb="4" align="baseline" justify="center">
              <Heading as="h3" size="5" mt="-1">
                <Text>Edit Workout</Text>
              </Heading>
            </Flex>
            <Box mb="5" position="relative">
              <Text
                as="label"
                size="2"
                weight="bold"
                htmlFor={fields.title.name}
              >
                Title
              </Text>
              {fields.title.errors && (
                <Text size="1" color="red">
                  {fields.title.errors}
                </Text>
              )}
              <TextField.Root
                placeholder="Legs, Back, Chest, etc."
                id={fields.title.name}
                name={fields.title.name}
                defaultValue={workout.title}
                type="text"
              />
            </Box>

            <Flex direction="column">
              {activitiesFields.map((activity, activityIndex) => {
                const activityFields = activity.getFieldset();
                const setsFields = activityFields.sets.getFieldList();

                return (
                  <Card key={activity.id} mb="3">
                    <Text
                      as="label"
                      size="2"
                      weight="bold"
                      htmlFor={activityFields.name.name}
                    >
                      Activity
                    </Text>
                    {activityFields.name.errors && (
                      <Text size="1" color="red">
                        {activityFields.name.errors}
                      </Text>
                    )}
                    <TextField.Root
                      placeholder="Squats"
                      id={activityFields.name.name}
                      name={activityFields.name.name}
                      defaultValue={activityFields.name.defaultValue}
                      type="text"
                    />

                    <Box>
                      {setsFields.map((set, setIndex) => {
                        const setFields = set.getFieldset();
                        return (
                          <Box key={set.id}>
                            <Grid mb="3" px="4" py="2">
                              <Text
                                as="label"
                                size="2"
                                weight="bold"
                                htmlFor={setFields.reps.name}
                              >
                                Reps
                              </Text>
                              {setFields.reps.errors && (
                                <Text size="1" color="red">
                                  {setFields.reps.errors}
                                </Text>
                              )}
                              <TextField.Root
                                placeholder="10"
                                id={setFields.reps.name}
                                name={setFields.reps.name}
                                defaultValue={setFields.reps.defaultValue}
                                type="number"
                              />

                              <Text
                                as="label"
                                size="2"
                                weight="bold"
                                htmlFor={setFields.weight.name}
                              >
                                Weight
                              </Text>
                              {setFields.weight.errors && (
                                <Text size="1" color="red">
                                  {setFields.weight.errors}
                                </Text>
                              )}
                              <TextField.Root
                                placeholder="120"
                                id={setFields.weight.name}
                                name={setFields.weight.name}
                                defaultValue={setFields.weight.defaultValue}
                                type="number"
                              />
                              <Button
                                size="1"
                                color="red"
                                variant="soft"
                                mt="2"
                                {...form.remove.getButtonProps({
                                  name: `${fields.activities.name}[${activityIndex}].sets`,
                                  index: setIndex,
                                })}
                              >
                                Remove
                              </Button>
                              <Box my="4">
                                <Separator size="4" />
                              </Box>
                            </Grid>
                          </Box>
                        );
                      })}
                    </Box>
                    <Flex align="baseline" justify="between">
                      <Button
                        {...form.insert.getButtonProps({
                          name: `${fields.activities.name}[${activityIndex}].sets`,
                        })}
                      >
                        Add set
                      </Button>
                      <Button
                        variant="soft"
                        color="red"
                        {...form.remove.getButtonProps({
                          name: fields.activities.name,
                          index: activityIndex,
                        })}
                      >
                        Remove activity
                      </Button>
                    </Flex>
                  </Card>
                );
              })}
            </Flex>

            <Button
              {...form.insert.getButtonProps({
                name: fields.activities.name,
                defaultValue: { name: "", sets: [{ reps: "", weight: "" }] },
              })}
            >
              Add activity
            </Button>
            <Flex align="baseline" justify="center">
              <Button variant="soft">Update Workout</Button>
            </Flex>
          </Form>
        </Card>
      </Section>
    </Container>
  );
}

export function ErrorBoundary() {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: ({ params }) => (
          <p>No note with the id "{params.workoutId}" exists</p>
        ),
      }}
    />
  );
}
