// Adjust the import according to your actual Button component
import DropDownDelete from "./DropDownDelete"; // Adjust the import according to your actual DropDownDelete component
import { Button } from "~/components/ui/button"; // Adjust the import according to your actual Button component
import { Field } from "~/components/Forms"; // Adjust the import according to your actual Field component
import Set from "./Set"; // Import the Set component

interface ActivityProps {
  activityPlaceholder?: string;
  repsPlaceholder?: string;
  weightPlaceholder?: string;
  onRemoveSet: () => void;
  onAddSet: () => void;
}

const Activity = ({
  activityPlaceholder = "Squat",
  repsPlaceholder = "10",
  weightPlaceholder = "120",
  onRemoveSet,
  onAddSet,
}: ActivityProps) => {
  return (
    <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow p-4">
      <div className="flex justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Activity
        </h3>
        <DropDownDelete />
      </div>
      <Field
        labelProps={{
          children: "Name",
        }}
        inputProps={{
          name: "activity",
          id: "activity",
          placeholder: activityPlaceholder,
        }}
        className="grid gap-2 flex-grow"
      />

      <Set
        repsPlaceholder={repsPlaceholder}
        weightPlaceholder={weightPlaceholder}
        onRemove={onRemoveSet}
      />

      <div className="grid col-span-3 col-start-2 gap-2">
        <Button variant="secondary" onClick={onAddSet}>
          Add Set
        </Button>
      </div>
    </div>
  );
};

export default Activity;
