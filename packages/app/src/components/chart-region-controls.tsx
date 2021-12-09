import { RadioGroup, RadioGroupItem } from '~/components/radio-group';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
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
      ariaLabel: replaceVariablesInText(siteText.aria_labels.map_toggle_label, {
        label: siteText.charts.region_controls.municipal
      }),
    },
    {
      label: siteText.charts.region_controls.region,
      value: 'vr',
      ariaLabel: replaceVariablesInText(siteText.aria_labels.map_toggle_label, {
        label: siteText.charts.region_controls.region
      }),
    },
  ];

  return <RadioGroup items={items} value={value} onChange={onChange} />;
}
