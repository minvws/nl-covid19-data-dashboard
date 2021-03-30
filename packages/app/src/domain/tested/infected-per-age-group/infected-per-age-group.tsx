import { NlTestedPerAgeGroupValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useMemo } from 'react';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { TooltipSeriesList } from '~/components-styled/time-series-chart/components/tooltip/tooltip-series-list';
import { LineSeriesDefinition } from '~/components-styled/time-series-chart/logic';
import { useIntl } from '~/intl';
import { useList } from '~/utils/use-list';
import { AgeGroupLegend } from './components/age-group-legend';
import { SERIES_CONFIG } from './series-config';

interface InfectedPerAgeGroup {
  values?: NlTestedPerAgeGroupValue[];
  timeframe: 'all' | '5weeks' | 'week';
}

export function InfectedPerAgeGroup({ timeframe }: InfectedPerAgeGroup) {
  // @TODO remove mock data
  // Start mock data
  const mockData: NlTestedPerAgeGroupValue[] = [];

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < 5 * 7; ++i) {
    const lastValue = mockData[mockData.length - 1];
    mockData.push({
      date_of_insertion_unix: 0,
      date_unix: new Date(currentDate.getTime() - 7).getTime() / 1000,

      infected_age_0_9_per_100k: Math.round(
        Math.max(
          0,
          lastValue
            ? lastValue.infected_age_0_9_per_100k + Math.random() * 50 - 25
            : Math.random() * 200
        )
      ),
      infected_age_10_19_per_100k: Math.round(
        Math.max(
          0,
          lastValue
            ? lastValue.infected_age_10_19_per_100k + Math.random() * 50 - 25
            : Math.random() * 200
        )
      ),
      infected_age_20_29_per_100k: Math.round(
        Math.max(
          0,
          lastValue
            ? lastValue.infected_age_20_29_per_100k + Math.random() * 50 - 25
            : Math.random() * 200
        )
      ),
      infected_age_30_39_per_100k: Math.round(
        Math.max(
          0,
          lastValue
            ? lastValue.infected_age_30_39_per_100k + Math.random() * 50 - 25
            : Math.random() * 200
        )
      ),
      infected_age_40_49_per_100k: Math.round(
        Math.max(
          0,
          lastValue
            ? lastValue.infected_age_40_49_per_100k + Math.random() * 50 - 25
            : Math.random() * 200
        )
      ),
      infected_age_50_59_per_100k: Math.round(
        Math.max(
          0,
          lastValue
            ? lastValue.infected_age_50_59_per_100k + Math.random() * 50 - 25
            : Math.random() * 200
        )
      ),
      infected_age_60_69_per_100k: Math.round(
        Math.max(
          0,
          lastValue
            ? lastValue.infected_age_60_69_per_100k + Math.random() * 50 - 25
            : Math.random() * 200
        )
      ),
      infected_age_70_79_per_100k: Math.round(
        Math.max(
          0,
          lastValue
            ? lastValue.infected_age_70_79_per_100k + Math.random() * 50 - 25
            : Math.random() * 200
        )
      ),
      infected_age_80_89_per_100k: Math.round(
        Math.max(
          0,
          lastValue
            ? lastValue.infected_age_80_89_per_100k + Math.random() * 50 - 25
            : Math.random() * 200
        )
      ),
      infected_age_90_plus_per_100k: Math.round(
        Math.max(
          0,
          lastValue
            ? lastValue.infected_age_90_plus_per_100k + Math.random() * 50 - 25
            : Math.random() * 200
        )
      ),
      infected_overall_per_100k: Math.round(
        Math.max(
          0,
          lastValue
            ? lastValue.infected_overall_per_100k + Math.random() * 50 - 25
            : Math.random() * 200
        )
      ),
    });

    currentDate.setDate(currentDate.getDate() - 1);
  }

  const values = mockData.reverse();
  // End mock data

  const { list, toggle, clear } = useList<string>();

  const { siteText } = useIntl();
  const text = siteText.infected_per_age_group;

  const ageGroupLegendConfig: LineSeriesDefinition<NlTestedPerAgeGroupValue>[] = useMemo(() => {
    return SERIES_CONFIG.map((baseAgeGroup) => {
      return {
        ...baseAgeGroup,
        type: 'line',
        label:
          baseAgeGroup.metricProperty in text.legend
            ? text.legend[baseAgeGroup.metricProperty]
            : baseAgeGroup.metricProperty,
      };
    });
  }, [text.legend]);

  const ageGroupChartConfig = useMemo(() => {
    return ageGroupLegendConfig.filter(
      (item) => list.includes(item.metricProperty) || list.length === 0
    );
  }, [ageGroupLegendConfig, list]);

  /* Conditionally wrap tooltip over two columns due to amount of items */
  const tooltipColumns = list.length === 0 || list.length > 4 ? 2 : 1;

  return (
    <>
      <TimeSeriesChart
        values={values}
        timeframe={timeframe}
        seriesConfig={ageGroupChartConfig}
        disableLegend
        formatTooltip={(data) => (
          <div css={css({ columns: tooltipColumns })}>
            <TooltipSeriesList data={data} />
          </div>
        )}
      />
      <AgeGroupLegend
        seriesConfig={ageGroupLegendConfig}
        ageGroupSelection={list}
        onToggleAgeGroup={toggle}
        onReset={clear}
      />
    </>
  );
}
