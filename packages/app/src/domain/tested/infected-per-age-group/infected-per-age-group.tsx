import { NlTestedPerAgeGroupValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useMemo } from 'react';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { TooltipSeriesList } from '~/components-styled/time-series-chart/components/tooltip/tooltip-series-list';
import { LineSeriesDefinition } from '~/components-styled/time-series-chart/logic';
import { useIntl } from '~/intl';
import { useList } from '~/utils/use-list';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { AgeGroupLegend } from './components/age-group-legend';
import { SERIES_CONFIG } from './series-config';

interface InfectedPerAgeGroup {
  values: NlTestedPerAgeGroupValue[];
  timeframe: 'all' | '5weeks' | 'week';
}

export function InfectedPerAgeGroup({
  values,
  timeframe,
}: InfectedPerAgeGroup) {
  const { list, toggle, clear } = useList<string>();

  const breakpoints = useBreakpoints(true);

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
        height={breakpoints.md ? 300 : 250}
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
