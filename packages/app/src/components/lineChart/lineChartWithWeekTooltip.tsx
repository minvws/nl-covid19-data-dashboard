import React, { useMemo } from 'react';
import { HighchartsWrapper } from '~/components/highcharts-wrapper';
import { colors } from '~/style/theme';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { getFilteredValues, TimeframeOption } from '~/utils/timeframe';

export interface Value {
  date: number;
  value: number;
  week: Week;
}

type Week = {
  start: number;
  end: number;
};

type LineChartWithWeekProps = {
  values: Value[];
  timeframe?: TimeframeOption;
  formatYAxis?: (y: number) => string;
  tooltipFormatter?: Highcharts.TooltipFormatterCallbackFunction;
};

export function LineChartWithWeekTooltip({
  values,
  formatYAxis,
  tooltipFormatter,
  timeframe = '5weeks',
}: LineChartWithWeekProps) {
  const chartOptions = useMemo(() => {
    const filteredValues = getFilteredValues<Value>(
      values,
      timeframe,
      (value: Value) => value.date * 1000
    );
    return getOptions(filteredValues, tooltipFormatter, formatYAxis);
  }, [values, timeframe, tooltipFormatter, formatYAxis]);

  return <HighchartsWrapper options={chartOptions} />;
}

function getOptions(
  values: Value[],
  tooltipFormatter?: Highcharts.TooltipFormatterCallbackFunction,
  formatYAxis?: (y: number) => string
): Highcharts.Options {
  const hasMultipleValues = values.length > 1;

  const series: Highcharts.SeriesAreaOptions[] = [
    {
      type: 'area',
      data: values.map((x) => ({ x: x.date, y: x.value, originalData: x })),
      name: '',
      showInLegend: false,
      color: colors.data.primary,
      fillColor: colors.data.fill,
      allowPointSelect: false,
      marker: {
        symbol: 'circle',
        enabled: !hasMultipleValues,
      },
      events: {
        legendItemClick: () => false,
      },
      states: {
        inactive: {
          opacity: 1,
        },
      },
    },
  ];

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
      height: 250,
    },
    legend: {
      itemWidth: 300,
      reversed: true,
      itemHoverStyle: {
        color: '#666',
      },
      itemStyle: {
        color: '#666',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 'normal',
        textOverflow: 'ellipsis',
      },
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      lineColor: colors.silver,
      gridLineColor: '#ca005d',
      type: 'datetime',
      accessibility: {
        rangeDescription: 'Verloop van tijd',
      },
      title: {
        text: null,
      },
      categories: values.map((value) => value?.date.toString()),
      labels: {
        align: 'right',
        // type definition says `rotation` needs to be a number,
        // but that doesn’t work.
        rotation: '0' as any,
        formatter: function () {
          return this.isFirst || this.isLast
            ? formatDateFromSeconds(this.value, 'axis')
            : '';
        },
      },
    },
    tooltip: {
      backgroundColor: '#FFF',
      borderColor: '#01689B',
      borderRadius: 0,
      formatter:
        tooltipFormatter ??
        function () {
          const { originalData } = (this.point as unknown) as {
            originalData: Value;
          };

          return `<strong>${formatDateFromSeconds(
            originalData.week.start,
            'short'
          )} - ${formatDateFromSeconds(
            originalData.week.end,
            'short'
          )}:</strong> ${formatNumber(this.y)}`;
        },
    },
    yAxis: {
      min: 0,
      minRange: 0.1,
      allowDecimals: false,
      lineColor: colors.silver,
      gridLineColor: colors.silver,
      title: {
        text: null,
      },
      labels: {
        formatter: function () {
          if (formatYAxis) {
            return formatYAxis(this.value);
          }
          return formatNumber(this.value);
        },
      },
    },
    title: {
      text: undefined,
    },
    series,
  };

  return options;
}
