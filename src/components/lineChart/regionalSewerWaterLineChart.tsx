import { useMemo } from 'react';
import Highcharts, {
  SeriesLineOptions,
  SeriesScatterOptions,
} from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { formatNumber } from '~/utils/formatNumber';
import { getItemFromArray } from '~/utils/getItemFromArray';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { SewerValue } from '~/types/data';

import styles from './lineChart.module.scss';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import Dot from '~/assets/dot.svg';
import Line from '~/assets/line.svg';
import { TimeframeOption } from '../chartTimeControls';
import { getFilteredValues } from '../chartTimeControls/chartTimeControlUtils';

type Value = {
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
  selectedRWZI?: string;
};

type Week = {
  start: number;
  end: number;
};

type TranslationStrings = {
  average_label_text: string;
  secondary_label_text: string;
  range_description: string;
  daily_label_text: string;
};

function getOptions(
  averageValues: Value[],
  scatterPlotValues: SewerValue[],
  text: TranslationStrings,
  selectedRWZI: string | undefined,
  timeframe: TimeframeOption
): Highcharts.Options {
  const hasMultipleValues = averageValues.length > 1;

  averageValues = getFilteredValues(
    averageValues,
    timeframe,
    (value) => value.date * 1000
  );
  scatterPlotValues = getFilteredValues(
    scatterPlotValues,
    timeframe,
    (value) => value.date_measurement_unix * 1000
  );

  const weekSet: Week[] = averageValues.map((value) => ({
    start: value.week_start_unix,
    end: value.week_end_unix,
  }));

  const weekSets: Record<string, Week[]> = {
    [text.average_label_text]: weekSet,
  };

  const scatterSerie: SeriesScatterOptions = {
    type: 'scatter',
    enableMouseTracking: false,
    name: text.secondary_label_text,
    description: text.secondary_label_text,
    color: '#CDCDCD',
    data: [],
    marker: {
      symbol: 'circle',
      radius: 3,
    },
  };

  scatterPlotValues?.forEach((value) => {
    scatterSerie.data?.push({
      x: value.date_measurement_unix,
      y: value.rna_per_ml,
    });
  });

  const series: (SeriesLineOptions | SeriesScatterOptions)[] = [scatterSerie];

  series.push({
    type: 'line',
    data: averageValues.map((x) => [x.date, x.value]),
    name: text.average_label_text,
    description: text.average_label_text,
    showInLegend: true,
    color: selectedRWZI ? '#A9A9A9' : '#3391CC',
    enableMouseTracking: selectedRWZI === undefined,
    allowPointSelect: false,
    marker: {
      symbol: 'circle',
      enabled: !hasMultipleValues,
    },
    states: {
      inactive: {
        opacity: 1,
      },
    },
  });

  if (selectedRWZI) {
    const scatterValues = scatterPlotValues.filter(
      (value) => value.rwzi_awzi_name === selectedRWZI
    );
    if (scatterValues.length) {
      series.push({
        type: 'line',
        data: scatterValues.map((scatterValue) => ({
          x: scatterValue.date_measurement_unix,
          y: scatterValue.rna_per_ml,
        })),
        name: selectedRWZI,
        description: replaceVariablesInText(text.daily_label_text, {
          name: selectedRWZI,
        }),
        color: '#004277',
        allowPointSelect: false,
        marker: {
          symbol: 'circle',
          enabled: false,
        },
        states: {
          inactive: {
            opacity: 1,
          },
        },
      });
    }

    weekSets[selectedRWZI] = scatterPlotValues
      .filter((plot) => plot.rwzi_awzi_name === selectedRWZI)
      .map((value) => ({
        start: value.week_start_unix,
        end: value.week_end_unix,
      }));
  }

  const options: Highcharts.Options = {
    chart: {
      alignTicks: true,
      animation: false,
      backgroundColor: 'transparent',
      borderColor: '#000',
      borderRadius: 0,
      borderWidth: 0,
      colorCount: 10,
      displayErrors: true,
      height: 225,
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      lineColor: '#C4C4C4',
      gridLineColor: '#ca005d',
      type: 'datetime',
      accessibility: {
        rangeDescription: text.range_description,
      },
      title: {
        text: null,
      },
      categories: averageValues.map((value) => value?.date.toString()),
      labels: {
        align: 'right',
        // types say `rotation` needs to be a number,
        // but that doesn’t work.
        rotation: '0' as any,
        formatter: function () {
          return this.isFirst || this.isLast
            ? formatDateFromSeconds(this.value, 'axis')
            : '';
        },
      },
    },
    yAxis: {
      min: 0,
      minRange: 0.1,
      allowDecimals: false,
      lineColor: '#C4C4C4',
      gridLineColor: '#C4C4C4',
      title: {
        text: null,
      },
      labels: {
        formatter: function () {
          return formatNumber(this.value);
        },
      },
    },
    title: {
      text: undefined,
    },
    tooltip: {
      backgroundColor: '#FFF',
      borderColor: '#01689B',
      borderRadius: 0,
      formatter: function (): false | string {
        const weeks = weekSets[this.series.name];

        if (!weeks) {
          return false;
        }

        const { start, end } = getItemFromArray(weeks, this.point.index);

        return `<strong>${formatDateFromSeconds(
          start,
          'short'
        )} - ${formatDateFromSeconds(end, 'short')}:</strong> ${formatNumber(
          this.y
        )}<br/>(${this.series.name})`;
      },
    },
    series,
  };

  return options;
}

export function RegionalSewerWaterLineChart(props: TProps) {
  const {
    averageValues,
    scatterPlotValues,
    text,
    timeframe,
    selectedRWZI,
  } = props;

  const chartOptions = useMemo(() => {
    return getOptions(
      averageValues,
      scatterPlotValues,
      text,
      selectedRWZI,
      timeframe
    );
  }, [averageValues, scatterPlotValues, text, selectedRWZI, timeframe]);

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <div>
        <ul className={styles.legenda}>
          {chartOptions.series?.map((serie) => (
            <li key={serie.name}>
              <div className={styles.legendaMarker}>
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
