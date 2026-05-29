import type { Difficulty } from "../types";
import { Label, DifficultyChip } from "./Primitives";

interface DiffRowProps {
  value: Difficulty;
  onChange: (d: Difficulty) => void;
  levels: Difficulty[];
}

export function DiffRow({ value, onChange, levels }: DiffRowProps) {
  return (
    <div>
      <Label>Difficulty</Label>
      <div className="flex gap-2 flex-wrap">
        {levels.map((d) => (
          <DifficultyChip key={d} level={d} selected={value === d} onClick={() => onChange(d)} />
        ))}
      </div>
    </div>
  );
}
