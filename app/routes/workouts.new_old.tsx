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
  VisuallyHidden,
  Grid,
  Separator,
} from "@radix-ui/themes";

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
                <Text>Enter Workout</Text>
              </Heading>
            </Flex>
            <Box mb="5" position="relative">
              <VisuallyHidden>
                <TextField.Root name="userId" defaultValue={user.id} />
              </VisuallyHidden>
              <Flex align="baseline" justify="between" mb="1">
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
              </Flex>
              <TextField.Root
                placeholder="Legs, Back, Chest, etc."
                id={fields.title.name}
                name={fields.title.name}
                // placeholder="Quads"
                type="text"
              />
            </Box>

            <Flex direction="column">
              {activitiesFields.map((activity, activityIndex) => {
                const activityFields = activity.getFieldset();
                const setsFields = activityFields.sets.getFieldList();

                return (
                  <Card key={activity.id} mb="3">
                    <Flex align="baseline" justify="between" mb="1">
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
                    </Flex>
                    <TextField.Root
                      placeholder="Squats"
                      id={activityFields.name.name}
                      name={activityFields.name.name}
                      type="text"
                    />

                    <Box>
                      {setsFields.map((set, setIndex) => {
                        const setFields = set.getFieldset();
                        return (
                          <Box key={set.id}>
                            <Grid mb="3" px="4" py="2">
                              <Flex align="baseline" justify="between" mb="1">
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
                              </Flex>
                              <TextField.Root
                                placeholder="10"
                                id={setFields.reps.name}
                                name={setFields.reps.name}
                                type="number"
                              />

                              <Flex align="baseline" justify="between" mb="1">
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
                              </Flex>
                              <TextField.Root
                                placeholder="120"
                                id={setFields.weight.name}
                                name={setFields.weight.name}
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
                defaultValue: createEmptyActivity(),
              })}
            >
              Add activity
            </Button>
            <Flex align="baseline" justify="center">
              <Button variant="soft">Create Workout</Button>
            </Flex>
          </Form>
        </Card>
      </Section>
    </Container>
  );
}
