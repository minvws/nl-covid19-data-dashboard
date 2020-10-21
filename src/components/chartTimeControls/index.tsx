import { IRadioGroupItem, RadioGroup } from '~/components/radioGroup';
import text from '~/locale/index';
import { TimeframeOption } from '~/utils/timeframe';
import styles from './chartTimeControls.module.scss';

interface IProps {
  timeframe: TimeframeOption;
  onChange: (value: TimeframeOption) => void;
  timeframeOptions?: TimeframeOption[];
}

export function ChartTimeControls(props: IProps) {
  const {
    timeframe,
    onChange,
    timeframeOptions = ['all', '5weeks', 'week'],
  } = props;

  const values = timeframeOptions.map<IRadioGroupItem>((key) => ({
    label: text.charts.time_controls[key],
    value: key,
  }));

  return (
    <RadioGroup
      value={timeframe}
      className={styles.root}
      onChange={onChange}
      values={values}
    />
  );
}
