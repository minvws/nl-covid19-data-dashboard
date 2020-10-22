import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { SewerValue } from '~/types/data';

import styles from './lineChart.module.scss';
import Dot from '~/assets/dot.svg';
import Line from '~/assets/line.svg';
import { TimeframeOption } from '~/utils/timeframe';
import { useRegionalSewerWaterChartOptions } from './hooks/useRegionalSewerWaterChartOptions';

export type Value = {
  date: number;
  value?: number;
  week_start_unix: number;
  week_end_unix: number;
};

export type TProps = {
  averageValues: Value[];
  scatterPlotValues: SewerValue[];
  text: TranslationStrings;
  timeframe: TimeframeOption;
  selectedInstallation?: string;
};

export type TranslationStrings = {
  average_label_text: string;
  secondary_label_text: string;
  range_description: string;
  daily_label_text: string;
};

export function RegionalSewerWaterChart(props: TProps) {
  const {
    averageValues,
    scatterPlotValues,
    text,
    timeframe,
    selectedInstallation: selectedRWZI,
  } = props;

  const chartOptions = useRegionalSewerWaterChartOptions(
    averageValues,
    scatterPlotValues,
    text,
    timeframe,
    selectedRWZI
  );

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <div>
        <ul className={styles.legend}>
          {chartOptions.series?.map((serie) => (
            <li key={serie.name}>
              <div className={styles.legendMarker}>
                {serie.type === 'scatter' && <Dot fill={serie.color} />}
                {serie.type === 'line' && <Line stroke={serie.color} />}
              </div>
              <div>{serie.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
