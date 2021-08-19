import { RadioGroup, RadioGroupItem } from '~/components/radio-group';
import { useIntl } from '~/intl';

export type RegionControlOption = 'gm' | 'vr';

interface ChartRegionControlsProps {
  value: RegionControlOption;
  onChange: (value: RegionControlOption) => void;
}

export function ChartRegionControls(props: ChartRegionControlsProps) {
  const { siteText } = useIntl();

  const { value, onChange } = props;

  const items: RadioGroupItem<RegionControlOption>[] = [
    {
      label: siteText.charts.region_controls.municipal,
      value: 'gm',
    },
    {
      label: siteText.charts.region_controls.region,
      value: 'vr',
    },
  ];

  return <RadioGroup items={items} value={value} onChange={onChange} />;
}
