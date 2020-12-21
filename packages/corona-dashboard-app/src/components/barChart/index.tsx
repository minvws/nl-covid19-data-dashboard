import { useMemo } from 'react';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { HighchartsWrapper } from '~/components/highcharts-wrapper';
import { colors } from '~/style/theme';

interface IProps {
  data: Highcharts.XrangePointOptionsObject[];
  keys: string[];
  axisTitle: string;
  valueAnnotation?: string;
}

export default function BarChart(props: IProps) {
  const { data, keys, axisTitle, valueAnnotation } = props;

  const options = useMemo<Highcharts.Options>(() => {
    const max = data.reduce((acc, value) => Math.max(acc, value.y || 0), 1);
    return {
      chart: {
        type: 'bar',
        backgroundColor: 'transparent',
        borderColor: '#000',
        borderRadius: 0,
        borderWidth: 0,
        className: 'barchart-container',
        colorCount: 10,
        displayErrors: true,
        margin: [],
        height: data.length * 35 + 50,
        maxWidth: 500,
      },
      title: { text: '' },
      tooltip: {
        enabled: true,
        outside: true,
        formatter: function (): string | false {
          if ((this.point as any).label) {
            return (this.point as any).label;
          }
          return false;
        },
      },
      credits: { enabled: false },
      xAxis: {
        categories: keys,
      },
      yAxis: {
        min: 0,
        max,
        allowDecimals: false,
        gridLineColor: '#c4c4c4',
        title: {
          text: axisTitle,
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          minPointLength: 5,
          groupPadding: 0,
          color: colors.data.primary,
        },
      },
      series: [
        {
          data,
          type: 'bar',
        },
      ],
    };
  }, [data, keys, axisTitle]);

  return (
    <>
      {valueAnnotation && (
        <ValueAnnotation mb={2}>{valueAnnotation}</ValueAnnotation>
      )}
      <HighchartsWrapper options={options} />
    </>
  );
}
