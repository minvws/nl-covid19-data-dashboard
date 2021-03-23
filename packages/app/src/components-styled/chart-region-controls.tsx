import { RadioGroup } from '~/components-styled/radio-group';
import { useIntl } from '~/intl';

export type RegionControlOption = 'municipal' | 'region';

interface ChartRegionControlsProps {
  value?: 'municipal' | 'region';
  onChange: (value: RegionControlOption) => void;
}

export function ChartRegionControls(props: ChartRegionControlsProps) {
  const { siteText } = useIntl();

  const { value, onChange } = props;

  const items = [
    {
      label: siteText.charts.region_controls.municipal,
      value: 'municipal',
    },
    {
      label: siteText.charts.region_controls.region,
      value: 'region',
    },
  ];

  return <RadioGroup items={items} value={value} onChange={onChange} />;
}
