import { useMemo } from 'react';
import styles from './chartTimeControls.module.scss';

import text from 'locale';

interface IProps {
  timeframe: string;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChartTimeControls: React.FC<IProps> = (props) => {
  const { timeframe, onChange } = props;

  const id = useMemo(() => Math.random().toString(36).substr(2), []);

  return (
    <div className={styles['chart-radio-group']} onChange={onChange}>
      <input
        id={`all-${id}`}
        type="radio"
        name={`timeframe-${id}`}
        value="all"
        checked={timeframe === 'all'}
      />
      <label htmlFor={`all-${id}`}>{text.charts.time_controls.all}</label>

      <input
        id={`month-${id}`}
        type="radio"
        name={`timeframe-${id}`}
        value="month"
        checked={timeframe === 'month'}
      />
      <label htmlFor={`month-${id}`}>{text.charts.time_controls.month}</label>

      <input
        id={`week-${id}`}
        type="radio"
        name={`timeframe-${id}`}
        value="week"
        checked={timeframe === 'week'}
      />
      <label htmlFor={`week-${id}`}>{text.charts.time_controls.week}</label>
    </div>
  );
};

export default ChartTimeControls;
