import { Box, Flex, Text, TextField, Button } from "@radix-ui/themes";
import { getInputProps } from "@conform-to/react";

interface SetProps {
  set: any;
  form: any;
  activityIndex: number;
  setIndex: number;
  removeSet: any;
}

const Set: React.FC<SetProps> = ({
  set,
  form,
  activityIndex,
  setIndex,
  removeSet,
}) => {
  const setFields = set.getFieldset();

  return (
    <Box key={set.id}>
      <Flex align="baseline" justify="between" mb="1">
        <Text as="label" size="2" weight="bold" htmlFor={setFields.reps.name}>
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
        <Text as="label" size="2" weight="bold" htmlFor={setFields.weight.name}>
          Weight
        </Text>
        {setFields.weight.errors && (
          <Text size="1" color="red">
            {setFields.weight.errors}
          </Text>
        )}
      </Flex>
      <TextField.Root
        placeholder="10"
        id={setFields.weight.name}
        name={setFields.weight.name}
        type="number"
      />

      <Button
        size="1"
        color="red"
        {...form.remove.getButtonProps({
          name: `${form.fields.activities.name}[${activityIndex}].sets`,
          index: setIndex,
        })}
      >
        Remove
      </Button>
    </Box>
  );
};

export default Set;
