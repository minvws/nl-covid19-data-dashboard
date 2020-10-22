import { RadioGroup } from '~/components-styled/radio-group';

import text from '~/locale/index';

export interface ChartRegionControlsProps {
  onChange: (value: 'municipal' | 'region') => void;
}

export function ChartRegionControls(props: ChartRegionControlsProps) {
  const { onChange } = props;

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

  return <RadioGroup items={items} onChange={onChange} />;
}
