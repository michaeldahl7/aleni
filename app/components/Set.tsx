type SetProps = {
  activityIndex: number;
  setIndex: number;
  reps: string;
  weight: string;
  handleSetChange: (activityIndex: number, setIndex: number, field: string, value: string) => void;
};

export default function Set({ activityIndex, setIndex, reps, weight, handleSetChange }: SetProps) {
  return (
    <div>
      <label>
        Reps:
        <input
          type="number"
          name={`reps-${activityIndex}-${setIndex}`}
          value={reps}
          onChange={(e) => handleSetChange(activityIndex, setIndex, "reps", e.target.value)}
          required
        />
      </label>
      <label>
        Weight (optional):
        <input
          type="number"
          name={`weight-${activityIndex}-${setIndex}`}
          value={weight}
          onChange={(e) => handleSetChange(activityIndex, setIndex, "weight", e.target.value)}
        />
      </label>
    </div>
  );
}
