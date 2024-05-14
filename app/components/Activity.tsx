
import Set from "./Set";

type ActivityProps = {
  activityIndex: number;
  name: string;
  sets: { reps: string; weight: string }[];
  addSet: (activityIndex: number) => void;
  handleActivityChange: (index: number, value: string) => void;
  handleSetChange: (activityIndex: number, setIndex: number, field: string, value: string) => void;
};

export default function Activity({
  activityIndex,
  name,
  sets,
  addSet,
  handleActivityChange,
  handleSetChange
}: ActivityProps) {
  return (
    <div>
      <label>
        Activity Name:
        <input
          type="text"
          name={`activity-name[]`}
          value={name}
          onChange={(e) => handleActivityChange(activityIndex, e.target.value)}
          required
        />
      </label>
      {sets.map((set, setIndex) => (
        <Set
          key={setIndex}
          activityIndex={activityIndex}
          setIndex={setIndex}
          reps={set.reps}
          weight={set.weight}
          handleSetChange={handleSetChange}
        />
      ))}
      <button type="button" aria-label="Add another set" onClick={() => addSet(activityIndex)}>
        + Add Set
      </button>
    </div>
  );
}
