import { SeriesLineOptions, SeriesScatterOptions } from 'highcharts';
import { useMemo } from 'react';
import { TimeframeOption } from '~/components/chartTimeControls';
import { getFilteredValues } from '~/components/chartTimeControls/chartTimeControlUtils';
import { SewerValue } from '~/types/data';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { getItemFromArray } from '~/utils/getItemFromArray';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { Value, TranslationStrings } from '../regionalSewerWaterChart';

type Week = {
  start: number;
  end: number;
};

export function useRegionalSewerWaterChartOptions(
  averageValues: Value[],
  scatterPlotValues: SewerValue[],
  text: TranslationStrings,
  selectedRWZI?: string,
  timeframe: TimeframeOption
): Highcharts.Options {
  return useMemo(() => {
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
      data: scatterPlotValues?.map((value) => ({
        x: value.date_measurement_unix,
        y: value.rna_per_ml,
      })),
      marker: {
        symbol: 'circle',
        radius: 3,
      },
    };

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
  }, [averageValues, scatterPlotValues, text, selectedRWZI, timeframe]);
}
