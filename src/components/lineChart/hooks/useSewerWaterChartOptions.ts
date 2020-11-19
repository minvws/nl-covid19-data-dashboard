import { SeriesLineOptions, SeriesScatterOptions } from 'highcharts';
import { useMemo } from 'react';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { getItemFromArray } from '~/utils/getItemFromArray';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { colors } from '~/style/theme';
import { getFilteredValues, TimeframeOption } from '~/utils/timeframe';

export interface SewerPerInstallationBaseValue {
  date_measurement_unix: number;
  rna_normalized: number;
  rwzi_awzi_name: string;
}

export type Value = {
  date: number;
  value?: number;
  week_start_unix: number;
  week_end_unix: number;
};

export type TranslationStrings = {
  average_label_text: string;
  secondary_label_text: string;
  range_description: string;
  daily_label_text: string;
};

type Week = {
  start: number;
  end: number;
};

function calculateDaysBetween(date1: number, date2: number) {
  const OneDay = 1000 * 60 * 60 * 24;

  const date1Milliseconds = date1 * 1000;
  const date2Milliseconds = date2 * 1000;

  const difference_ms = Math.abs(date1Milliseconds - date2Milliseconds);

  return Math.floor(difference_ms / OneDay);
}

/**
 * This function calculates the difference in days between the last RWZI measurement
 * and the last average and returns an array of data that is used to draw the dashed line
 * at the end of the averages.
 */
function createRemainingDaysData(value: Value | undefined, maxDate: number) {
  if (!value) return;

  const dataPointLength =
    calculateDaysBetween(value.week_start_unix, maxDate) + 1;

  const data = [...new Array(dataPointLength)];
  const oneDay = 60 * 60 * 24;

  return data.map((_, index) => {
    const extraDays = index * oneDay;
    return [value.week_start_unix + extraDays, value.value];
  });
}

export function useSewerWaterChartOptions<
  T extends SewerPerInstallationBaseValue
>(
  averageValues: Value[],
  scatterPlotValues: T[],
  text: TranslationStrings,
  timeframe: TimeframeOption,
  selectedRWZI?: string
): Highcharts.Options {
  const filteredAverageValues = useMemo(
    () =>
      getFilteredValues(averageValues, timeframe, (value) => value.date * 1000),
    [averageValues, timeframe]
  );

  const filteredScatterPlotValues = useMemo(
    () =>
      scatterPlotValues
        ? getFilteredValues(
            scatterPlotValues,
            timeframe,
            (value) => value.date_measurement_unix * 1000
          )
        : [],
    [scatterPlotValues, timeframe]
  );

  return useMemo(() => {
    const hasMultipleValues = filteredAverageValues.length > 1;

    const weekSet: Week[] = filteredAverageValues.map((value) => ({
      start: value.week_start_unix,
      end: value.week_end_unix,
    }));

    const averagesMaxDate = filteredAverageValues.reduce((max, value) => {
      return Math.max(max, value.week_start_unix);
    }, 0);
    const scatterMaxDate = filteredScatterPlotValues.reduce((max, value) => {
      return Math.max(max, value.date_measurement_unix);
    }, 0);

    const tooltipTypes: Record<string, Week[] | 'rwzi' | 'scatter'> = {
      [text.average_label_text]: weekSet,
      [text.secondary_label_text]: 'scatter',
    };

    const scatterSerie: SeriesScatterOptions = {
      type: 'scatter',
      name: text.secondary_label_text,
      description: text.secondary_label_text,
      color: '#CDCDCD',
      enableMouseTracking: selectedRWZI === undefined,
      data: filteredScatterPlotValues?.map((value) => ({
        x: value.date_measurement_unix,
        y: value.rna_normalized,
        installationName: value.rwzi_awzi_name,
      })),
      marker: {
        symbol: 'circle',
        radius: 3,
      },
    };

    const series: (SeriesLineOptions | SeriesScatterOptions)[] = [scatterSerie];

    series.push({
      type: 'line',
      data: filteredAverageValues.map((x) => [x.date, x.value]),
      name: text.average_label_text,
      description: text.average_label_text,
      showInLegend: true,
      color: selectedRWZI ? '#A9A9A9' : colors.data.primary,
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

    // If the max scatter plot date is higher than the averages, we want to draw
    // a dotted line for the missing days between the max scatter date
    // and the max averages date:
    if (scatterMaxDate > averagesMaxDate) {
      series.push({
        type: 'line',
        data: createRemainingDaysData(
          filteredAverageValues.find((value) => value.date === averagesMaxDate),
          scatterMaxDate
        ),
        name: '',
        description: '',
        showInLegend: false,
        color: selectedRWZI ? '#A9A9A9' : colors.data.primary,
        enableMouseTracking: false,
        allowPointSelect: false,
        dashStyle: 'ShortDot',
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
    }

    if (selectedRWZI) {
      const scatterValues = filteredScatterPlotValues.filter(
        (value) => value.rwzi_awzi_name === selectedRWZI
      );
      if (scatterValues.length) {
        series.push({
          type: 'line',
          data: scatterValues.map((scatterValue) => ({
            x: scatterValue.date_measurement_unix,
            y: scatterValue.rna_normalized,
            rwzi: true,
          })),
          name: selectedRWZI,
          description: replaceVariablesInText(text.daily_label_text, {
            name: selectedRWZI,
          }),
          color: colors.data.secondary,
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

      tooltipTypes[selectedRWZI] = 'rwzi';
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
        categories: filteredAverageValues.map((value) =>
          value?.date.toString()
        ),
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
          const tooltipType = tooltipTypes[this.series.name];

          if (!tooltipType) {
            return false;
          }

          if (Array.isArray(tooltipType)) {
            const { start, end } = getItemFromArray(
              tooltipType,
              this.point.index
            );

            return `<strong>${formatDateFromSeconds(
              start,
              'short'
            )} - ${formatDateFromSeconds(
              end,
              'short'
            )}:</strong> ${formatNumber(this.y)}<br/>(${this.series.name})`;
          } else if (tooltipType === 'rwzi') {
            return `<strong>${formatDateFromSeconds(this.point.x)}:</strong> ${
              this.point.y
            }<br/>(${this.series.name})`;
          } else if (tooltipType === 'scatter') {
            return `<strong>${formatDateFromSeconds(this.point.x)}:</strong> ${
              this.point.y
            }<br/>(${(this.point as any).installationName})`;
          }

          return false;
        },
      },
      series,
    };

    return options;
  }, [filteredAverageValues, filteredScatterPlotValues, text, selectedRWZI]);
}
