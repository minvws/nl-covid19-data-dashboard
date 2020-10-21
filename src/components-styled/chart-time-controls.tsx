import { RadioGroup } from '~/components-styled/radio-group';
import text from '~/locale/index';
import { TimeframeOption } from '~/utils/timeframe';

interface ChartTimeControlsProps {
  timeframe: TimeframeOption;
  onChange: (value: TimeframeOption) => void;
  timeframeOptions?: TimeframeOption[];
}

// .root {
//   /*
//     @TODO These are not right here. The parent component should be responsible
//     for the positioning.
//   */
//   margin: 1em 0;
//   justify-content: center;

//   /* Extra specificity to overrule radio-group rules */
//   &.root {
//     label {
//       padding: 0.2em 1.5em;
//       flex: 0 1 auto;
//     }
//   }
// }

export function ChartTimeControls(props: ChartTimeControlsProps) {
  const {
    timeframe,
    onChange,
    timeframeOptions = ['all', '5weeks', 'week'],
  } = props;

  const items = timeframeOptions.map((key) => ({
    label: text.charts.time_controls[key],
    value: key,
  }));

  return <RadioGroup value={timeframe} onChange={onChange} items={items} />;
}
