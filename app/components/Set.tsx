import { Button } from "~/components/ui/button"; // Adjust the import according to your actual Button component
import { Field } from "~/components/Forms"; // Adjust the import according to your actual Field component

interface SetProps {
  repsPlaceholder?: string;
  weightPlaceholder?: string;
  onRemove: () => void;
}

const Set = ({
  repsPlaceholder = "10",
  weightPlaceholder = "120",
  onRemove,
}: SetProps) => {
  return (
    <div className="grid grid-cols-5 gap-4">
      <Field
        labelProps={{ htmlFor: "reps", children: "Reps" }}
        inputProps={{ id: "reps", placeholder: repsPlaceholder }}
        className="grid col-span-2 gap-2"
      />

      <Field
        labelProps={{ htmlFor: "weight", children: "Weight" }}
        inputProps={{ id: "weight", placeholder: weightPlaceholder }}
        className="grid col-span-2 gap-2"
      />

      <div className="grid gap-2">
        <Button
          variant="destructive"
          className="self-center -mt-4"
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default Set;
