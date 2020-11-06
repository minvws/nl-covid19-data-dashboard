import { RadioGroup } from '~/components-styled/radio-group';
import { TimeframeOption } from '~/utils/timeframe';

interface ChartTimeControlsProps {
  timeframe: TimeframeOption;
  onChange: (value: TimeframeOption) => void;
  timeframeOptions?: TimeframeOption[];
  timeControls: {
    all: string;
    week: string;
    '5weeks': string;
  };
}

export function ChartTimeControls(props: ChartTimeControlsProps) {
  const {
    timeframe,
    onChange,
    timeframeOptions = ['all', '5weeks', 'week'],
    timeControls,
  } = props;

  const items = timeframeOptions.map((key) => ({
    label: timeControls[key],
    value: key,
  }));

  return <RadioGroup value={timeframe} onChange={onChange} items={items} />;
}
