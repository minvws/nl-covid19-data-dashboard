import css from '@styled-system/css';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import styled from 'styled-components';
import Dot from '~/assets/dot.svg';
import Line from '~/assets/line.svg';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { RegionalSewerPerInstallationValue } from '~/types/data';
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
  scatterPlotValues: RegionalSewerPerInstallationValue[];
  text: TranslationStrings;
  timeframe: TimeframeOption;
  selectedInstallation?: string;
  valueAnnotation?: string;
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
    valueAnnotation,
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
      {valueAnnotation && (
        <ValueAnnotation mb={2}>{valueAnnotation}</ValueAnnotation>
      )}
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <div>
        <ul>
          {chartOptions.series
            ?.filter((serie) => serie.description?.length)
            .map((serie) => (
              <LegendItem key={serie.name}>
                <LegendMarker>
                  {serie.type === 'scatter' && <Dot fill={serie.color} />}
                  {serie.type === 'line' && <Line stroke={serie.color} />}
                </LegendMarker>
                <div>{serie.description}</div>
              </LegendItem>
            ))}
        </ul>
      </div>
    </>
  );
}

const LegendItem = styled.li(
  css({
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'row',
  })
);

const LegendMarker = styled.div(
  css({
    height: '0.5em',
    width: '0.5em',
    mr: '0.5em',

    svg: {
      height: '100%',
      width: '100%',
    },
  })
);
