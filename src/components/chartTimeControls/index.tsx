import styles from './chartTimeControls.module.scss';

import RadioGroup, { IRadioGroupItem } from 'components/radioGroup';

import text from 'locale';

export type TimeframeOption = 'all' | '5weeks' | 'week';

interface IProps {
  timeframe: TimeframeOption;
  onChange: (value: TimeframeOption) => void;
  timeframeOptions: TimeframeOption[];
}

export default ChartTimeControls;

function ChartTimeControls(props: IProps) {
  const { timeframe, onChange, timeframeOptions } = props;

  const values = timeframeOptions.map<IRadioGroupItem>((key) => ({
    label: text.charts.time_controls[key],
    value: key,
  }));

  return (
    <RadioGroup
      value={timeframe}
      className={styles['chart-radio-group']}
      onChange={onChange}
      values={values}
    />
  );
}

ChartTimeControls.defaultProps = {
  timeframeOptions: ['all', '5weeks', 'week'],
};
