import { RadioGroup } from '~/components-styled/radio-group';

export type RegionControlOption = 'municipal' | 'region';

export interface ChartRegionControlsProps {
  controls: {
    municipal: string;
    region: string;
  };
  onChange: (value: RegionControlOption) => void;
}

export function ChartRegionControls(props: ChartRegionControlsProps) {
  const { controls, onChange } = props;

  const items = [
    {
      label: controls.municipal,
      value: 'municipal',
    },
    {
      label: controls.region,
      value: 'region',
    },
  ];

  return <RadioGroup items={items} onChange={onChange} />;
}
