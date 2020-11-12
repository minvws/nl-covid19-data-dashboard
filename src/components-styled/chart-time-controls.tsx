import { RadioGroup } from '~/components-styled/radio-group';
import text from '~/locale/index';
import { TimeframeOption } from '~/utils/timeframe';

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

  const items = timeframeOptions.map((key) => ({
    label: text.charts.time_controls[key],
    value: key,
  }));

  return <RadioGroup value={timeframe} onChange={onChange} items={items} />;
}
