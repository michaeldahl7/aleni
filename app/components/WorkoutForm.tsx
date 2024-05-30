// components/WorkoutForm.tsx

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
import { z } from "zod";
import { Form, useActionData } from "@remix-run/react";
import { parseWithZod } from "@conform-to/zod";

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

export function WorkoutForm({ defaultValues, onValidate }) {
  const lastResult = useActionData();

  const [form, fields] = useForm({
    lastResult,
    defaultValue: defaultValues,
    onValidate,
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
                <Text>
                  {defaultValues?.title ? "Edit Workout" : "Enter Workout"}
                </Text>
              </Heading>
            </Flex>
            <Box mb="5" position="relative">
              <VisuallyHidden>
                <TextField.Root
                  name="userId"
                  defaultValue={defaultValues?.userId}
                />
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
                defaultValue={defaultValues?.title}
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
                      defaultValue={activityFields.name.defaultValue}
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
                                defaultValue={setFields.reps.defaultValue}
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
                defaultValue: createEmptyActivity(),
              })}
            >
              Add activity
            </Button>
            <Flex align="baseline" justify="center">
              <Button variant="soft">
                {defaultValues?.title ? "Update Workout" : "Create Workout"}
              </Button>
            </Flex>
          </Form>
        </Card>
      </Section>
    </Container>
  );
}
