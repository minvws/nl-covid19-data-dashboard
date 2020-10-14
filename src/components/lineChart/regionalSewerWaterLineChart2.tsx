import { useMemo, useState } from 'react';
import Highcharts, {
  SeriesLineOptions,
  SeriesScatterOptions,
} from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { formatNumber } from '~/utils/formatNumber';
import { getItemFromArray } from '~/utils/getItemFromArray';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { ComboBox, TOption } from '../comboBox';
import { SewerValue } from '~/types/data';

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
};

type Week = {
  start: number;
  end: number;
};

type TranslationStrings = Record<string, string>;

function getOptions(
  averageValues: Value[],
  scatterPlotValues: SewerValue[],
  text: TranslationStrings,
  selectedRWZI?: string
): [Highcharts.Options, TOption[]] {
  const hasMultipleValues = averageValues.length > 1;
  const weekSet: Week[] = averageValues.map((value) => ({
    start: value.week_start_unix,
    end: value.week_end_unix,
  }));

  const weekSets: Record<string, Week[]> = {
    [text.average_label_text]: weekSet,
  };

  const sewerStationNames: TOption[] = [];

  const series: (SeriesLineOptions | SeriesScatterOptions)[] =
    scatterPlotValues?.reduce<SeriesScatterOptions[]>((series, value) => {
      let serie = series.find((serie) => serie.name === value.rwzi_awzi_name);
      if (!serie) {
        serie = {
          type: 'scatter',
          enableMouseTracking: false,
          name: value.rwzi_awzi_name,
          showInLegend: false,
          color: 'lightgrey',
          data: [],
          marker: {
            symbol: 'circle',
            radius: 3,
          },
        };
        series.push(serie);
        sewerStationNames.push({ name: value.rwzi_awzi_name });
      }
      serie.data?.push({ x: value.date_measurement_unix, y: value.rna_per_ml });

      return series;
    }, []) ?? [];

  series.push({
    type: 'line',
    data: averageValues.map((x) => [x.date, x.value]),
    name: text.average_label_text,
    showInLegend: true,
    color: selectedRWZI ? 'grey' : '#3391CC',
    enableMouseTracking: selectedRWZI === undefined,
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
  });

  if (selectedRWZI) {
    const serie = series.find((serie) => serie.name === selectedRWZI);
    if (serie?.data) {
      series.push({
        type: 'line',
        data: serie?.data,
        name: selectedRWZI,
        showInLegend: true,
        color: '#3391CC',
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
      lineColor: '#C4C4C4',
      gridLineColor: '#ca005d',
      type: 'datetime',
      accessibility: {
        rangeDescription: 'Verloop van tijd',
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
        )}`;
      },
    },
    series,
  };

  return [options, sewerStationNames];
}

export function RegionalSewerWaterLineChart2(props: TProps) {
  const { averageValues, scatterPlotValues, text } = props;
  const [selectedRWZI, setSelectedRWZI] = useState<string | undefined>();

  const [chartOptions, sewerStationNames] = useMemo(() => {
    return getOptions(averageValues, scatterPlotValues, text, selectedRWZI);
  }, [averageValues, scatterPlotValues, text, selectedRWZI]);

  return (
    <>
      <ComboBox<TOption>
        placeholder="Choose"
        onSelect={(selected) => setSelectedRWZI(selected.name)}
        options={sewerStationNames}
      />
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </>
  );
}
