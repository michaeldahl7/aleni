import { Box, Flex, Text, TextField, Button } from "@radix-ui/themes";
import { getInputProps } from "@conform-to/react";
import Set from "./Set";

interface ActivityProps {
  activity: any;
  form: any;
  activityIndex: number;
  removeActivity: any;
}

const Activity: React.FC<ActivityProps> = ({
  activity,
  form,
  activityIndex,
  removeActivity,
}) => {
  const activityFields = activity.getFieldset();
  const setsFields = activityFields.sets.getFieldList();

  return (
    <Box key={activity.id}>
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
        {setsFields.map((set, setIndex) => (
          <Set
            key={set.id}
            set={set}
            form={form}
            activityIndex={activityIndex}
            setIndex={setIndex}
            removeSet={form.remove.getButtonProps({
              name: `${form.fields.activities.name}[${activityIndex}].sets`,
              index: setIndex,
            })}
          />
        ))}
      </Box>
      <div>
        <Button
          {...form.insert.getButtonProps({
            name: `${form.fields.activities.name}[${activityIndex}].sets`,
          })}
        >
          Add set
        </Button>
        <Button size="1" color="red" {...removeActivity}>
          Remove activity
        </Button>
      </div>
    </Box>
  );
};

export default Activity;
