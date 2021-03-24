interface AgeGroupLegendProps {
  seriesConfig: {
    label: string;
  }[];
  ageGroupSelection: string[];
  onToggleAgeGroup: (ageGroupRange: string) => void;
  onReset: () => void;
}

export function AgeGroupLegend({
  seriesConfig,
  ageGroupSelection,
  onToggleAgeGroup,
  onReset,
}: AgeGroupLegendProps) {
  return (
    <>
      <ul>
        {seriesConfig.map((line) => (
          <li key={line.label}>
            <button onClick={() => onToggleAgeGroup(line.label)}>
              {line.label}{' '}
              {ageGroupSelection.includes(line.label) ? ' SELECTED' : '-'}
            </button>
          </li>
        ))}
      </ul>
      <button disabled={ageGroupSelection.length === 0} onClick={onReset}>
        RESET!
      </button>
    </>
  );
}
