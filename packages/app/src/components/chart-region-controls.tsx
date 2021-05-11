import { RadioGroup } from '~/components/radio-group';
import { useIntl } from '~/intl';

export type RegionControlOption = 'municipal' | 'region';

interface ChartRegionControlsProps {
  value: RegionControlOption;
  onChange: (value: RegionControlOption) => void;
}

export function ChartRegionControls(props: ChartRegionControlsProps) {
  const { siteText } = useIntl();

  const { value, onChange } = props;

  const items = [
    {
      label: siteText.charts.region_controls.municipal,
      value: 'municipal' as RegionControlOption,
    },
    {
      label: siteText.charts.region_controls.region,
      value: 'region' as RegionControlOption,
    },
  ];

  return <RadioGroup items={items} value={value} onChange={onChange} />;
}
