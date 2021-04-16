import { RadioGroup } from '~/components/radio-group';
import { TimeframeOption } from '~/utils/timeframe';
import { useIntl } from '~/intl';

interface ChartTimeControlsProps {
  timeframe: TimeframeOption;
  onChange: (value: TimeframeOption) => void;
  timeframeOptions?: TimeframeOption[];
}

export function ChartTimeControls(props: ChartTimeControlsProps) {
  const {
    onChange,
    timeframe,
    timeframeOptions = ['all', '5weeks', 'week'],
  } = props;

  const { siteText } = useIntl();

  const items = timeframeOptions.map((key) => ({
    label: siteText.charts.time_controls[key],
    value: key,
  }));

  return <RadioGroup value={timeframe} onChange={onChange} items={items} />;
}
