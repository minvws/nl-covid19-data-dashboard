import css from '@styled-system/css';
import styled from 'styled-components';
import Dot from '~/assets/dot.svg';
import Line from '~/assets/line.svg';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { HighchartsWrapper } from '~/components/common/highcharts';
import { TimeframeOption } from '~/utils/timeframe';
import {
  SewerPerInstallationBaseValue,
  TranslationStrings,
  useSewerWaterChartOptions,
  Value,
} from './hooks/useSewerWaterChartOptions';

export type TProps<T extends SewerPerInstallationBaseValue> = {
  averageValues: Value[];
  scatterPlotValues?: T[];
  text: TranslationStrings;
  timeframe: TimeframeOption;
  selectedInstallation?: string;
  valueAnnotation?: string;
};

export function SewerWaterChart<T extends SewerPerInstallationBaseValue>(
  props: TProps<T>
) {
  const {
    averageValues,
    scatterPlotValues = [],
    text,
    timeframe,
    selectedInstallation: selectedRWZI,
    valueAnnotation,
  } = props;

  const chartOptions = useSewerWaterChartOptions(
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
      <HighchartsWrapper options={chartOptions} />
      {scatterPlotValues.length > 1 && (
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
      )}
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
