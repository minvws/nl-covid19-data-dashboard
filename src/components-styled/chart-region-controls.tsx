import { RadioGroup } from '~/components-styled/radio-group';

import text from '~/locale/index';

export type RegionControlOption = 'municipal' | 'region';

interface ChartRegionControlsProps {
  value?: 'municipal' | 'region';
  onChange: (value: RegionControlOption) => void;
}

const items = [
  {
    label: text.charts.region_controls.municipal,
    value: 'municipal',
  },
  {
    label: text.charts.region_controls.region,
    value: 'region',
  },
];

export function ChartRegionControls(props: ChartRegionControlsProps) {
  const { value, onChange } = props;

  return <RadioGroup items={items} value={value} onChange={onChange} />;
}
