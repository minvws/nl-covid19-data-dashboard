import { Box } from './base';
import { RadioGroup } from './radio-group';

export type ChartTileToggleItem = {
  label: string;
  value: string;
};

export interface ChartTileToggleProps {
  initialValue: string;
  items: ChartTileToggleItem[];
  onChange: (value: string) => void;
}

export const ChartTileToggle = ({ initialValue, items, onChange }: ChartTileToggleProps) => {
  return (
    <Box display="flex">
      <RadioGroup value={initialValue} items={items} onChange={onChange} />
    </Box>
  );
};
