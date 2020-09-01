import { useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import ChartTimeControls, {
  TimeframeOption,
} from 'components/chartTimeControls';

import formatNumber from 'utils/formatNumber';
import formatDate from 'utils/formatDate';
import { getFilteredValues } from 'components/chartTimeControls/chartTimeControlUtils';

if (typeof Highcharts === 'object') {
  require('highcharts/highcharts-more')(Highcharts);
}

type TRange = [Date, number | null, number | null];
type TLine = [Date, number | null];

interface AreaChartProps {
  rangeLegendLabel: string;
  lineLegendLabel: string;
  data: Array<{
    avg: number | null;
    date: number;
    min: number | null;
    max: number | null;
  }>;
  signaalwaarde?: number;
  timeframeOptions?: TimeframeOption[];
}

type IGetOptions = Omit<AreaChartProps, 'data'> & {
  rangeData: TRange[];
  lineData: TLine[];
};

export default AreaChart;

function getOptions(props: IGetOptions): Highcharts.Options {
  const {
    rangeData,
    signaalwaarde,
    lineData,
    rangeLegendLabel,
    lineLegendLabel,
  } = props;

  const options: Highcharts.Options = {
    chart: {
      alignTicks: true,
      animation: false,
      backgroundColor: 'transparent',
      borderColor: '#000',
      borderRadius: 0,
      borderWidth: 0,
      className: 'undefined',
      colorCount: 10,
      displayErrors: true,
      height: 175,
    },
    legend: false as any,
    credits: {
      enabled: false,
    },
    title: {
      text: undefined,
    },
    xAxis: {
      lineColor: '#C4C4C4',
      gridLineColor: '#ca005d',
      type: 'datetime',
      categories: rangeData.map((el) => el[0].getTime() as any),
      title: {
        text: null,
      },
      labels: {
        align: 'right',
        x: 10,
        rotation: '0' as any,
        formatter: function (): string {
          if (this.isFirst || this.isLast) {
            return formatDate(this.value, 'axis');
          }
          return '';
        },
      },
    },
    yAxis: {
      min: 0,
      lineColor: '#C4C4C4',
      gridLineColor: '#C4C4C4',
      title: {
        text: null,
      },
      labels: {
        formatter: function (): string {
          return formatNumber(this.value);
        },
      },
      plotLines: [],
    },

    tooltip: {
      shared: true,
      valueSuffix: 'R',
      backgroundColor: '#FFF',
      borderColor: '#01689B',
      borderRadius: 0,
      xDateFormat: '%d %b %y',
      formatter(): string {
        const rangePoint = rangeData.find((el) => el[0].getTime() === this.x);
        // @ts-ignore
        const [, minRangePoint, maxRangePoint] = rangePoint;
        const linePoint = lineData.find(
          (el: any) => el[0].getTime() === this.x
        );
        const x = this.x;
        return `
            ${formatDate(x, 'medium')}<br/>
            <strong>${rangeLegendLabel}</strong> ${formatNumber(
          minRangePoint
        )} - ${formatNumber(maxRangePoint)}<br/>
            <strong>${lineLegendLabel}</strong> ${
          linePoint ? formatNumber(linePoint[1] as number) : '–'
        }
          `;
      },
    },

    series: [
      {
        name: rangeLegendLabel,
        data: rangeData,
        type: 'arearange',
        color: '#C4C4C4',
        marker: {
          enabled: false,
        },
      },
      {
        name: lineLegendLabel,
        data: lineData.map((el) => el[1] as number),
        type: 'line',
        color: '#3391CC',
        lineWidth: 2,
        marker: {
          enabled: false,
        },
      },
    ],
  };

  if (signaalwaarde) {
    // @ts-ignore
    options.yAxis.plotLines.push({
      value: signaalwaarde,
      width: 1,
      color: '#4f5458',
    });
  }

  return options;
}

function AreaChart(props: AreaChartProps) {
  const {
    rangeLegendLabel,
    lineLegendLabel,
    data,
    signaalwaarde,
    timeframeOptions,
  } = props;

  const rangeData: TRange[] = useMemo(() => {
    return data
      .sort((a, b) => a.date - b.date)
      .map((d) => [new Date(d.date * 1000), d.min, d.max]);
  }, [data]);

  const lineData: TLine[] = useMemo(() => {
    return data.map((value) => {
      return [new Date(value.date * 1000), value.avg];
    });
  }, [data]);

  const [timeframe, setTimeframe] = useState<TimeframeOption>('5weeks');

  const chartOptions = useMemo(() => {
    const getOptionsThunk = (rangeData: TRange[], lineData: TLine[]) =>
      getOptions({
        rangeData,
        lineData,
        signaalwaarde,
        rangeLegendLabel,
        lineLegendLabel,
      });

    const filteredRange = getFilteredValues<TRange>(
      rangeData,
      timeframe,
      (value: TRange) => value[0].getTime()
    );

    const filteredLine = getFilteredValues<TLine>(
      lineData,
      timeframe,
      (value: TLine) => value[0].getTime()
    );

    return getOptionsThunk(filteredRange, filteredLine);
  }, [
    lineData,
    rangeData,
    signaalwaarde,
    lineLegendLabel,
    rangeLegendLabel,
    timeframe,
  ]);

  return (
    <>
      <ChartTimeControls
        timeframe={timeframe}
        timeframeOptions={timeframeOptions}
        onChange={(evt) => setTimeframe(evt.target.value as TimeframeOption)}
      />
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </>
  );
}
