import { useMemo, Fragment } from 'react';
import styles from './chartTimeControls.module.scss';

import text from 'locale';

export type TimeframeOption = 'all' | '5weeks' | 'week';

interface IProps {
  timeframe: string;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  timeframeOptions?: TimeframeOption[];
}

const ChartTimeControls: React.FC<IProps> = ({
  timeframe,
  timeframeOptions,
  onChange,
}) => {
  if (!timeframeOptions) {
    timeframeOptions = ['all', '5weeks', 'week'];
  }

  const id = useMemo(() => Math.random().toString(36).substr(2), []);

  return (
    <div className={styles['chart-radio-group']} onChange={onChange}>
      {timeframeOptions.map((option) => (
        <Fragment key={`${option}-${id}`}>
          <input
            id={`${option}-${id}`}
            type="radio"
            name={`timeframe-${id}`}
            value={option}
            defaultChecked={timeframe === option}
          />
          <label htmlFor={`${option}-${id}`}>
            {text.charts.time_controls[option]}
          </label>
        </Fragment>
      ))}
    </div>
  );
};

export default ChartTimeControls;
