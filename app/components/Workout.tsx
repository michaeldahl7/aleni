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
} from "@radix-ui/themes";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import Activity from "./Activity";
import { UserSelect } from "~/db/schema.server";
import { Form } from "@remix-run/react";

interface WorkoutProps {
  form: any;
  fields: {
    title: any;
    activities: {
      getFieldList: any;
      name: string;
    };
  };
  user: UserSelect;
  createEmptyActivity: () => any;
}

const Workout: React.FC<WorkoutProps> = ({
  form,
  fields,
  user,
  createEmptyActivity,
}) => {
  const activitiesFields = fields.activities.getFieldList();

  return (
    <Container size="3">
      <Section size="2">
        <Card asChild variant="classic" size="4">
          <Form method="post" {...getFormProps(form)}>
            <Box height="40px" mb="4">
              <Heading as="h3" size="5" mt="-1">
                <Box>Enter Workout</Box>
              </Heading>
            </Box>
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
                type="text"
              />
            </Box>

            <Flex direction="column">
              {activitiesFields.map((activity, activityIndex) => (
                <Activity
                  key={activity.id}
                  activity={activity}
                  form={form}
                  activityIndex={activityIndex}
                  removeActivity={form.remove.getButtonProps({
                    name: fields.activities.name,
                    index: activityIndex,
                  })}
                />
              ))}
            </Flex>

            <Button
              {...form.insert.getButtonProps({
                name: fields.activities.name,
                defaultValue: createEmptyActivity(),
              })}
            >
              Add activity
            </Button>
            <Box>
              <Button variant="surface" highContrast color="gray" type="submit">
                Create Workout
              </Button>
            </Box>
          </Form>
        </Card>
      </Section>
    </Container>
  );
};

export default Workout;
