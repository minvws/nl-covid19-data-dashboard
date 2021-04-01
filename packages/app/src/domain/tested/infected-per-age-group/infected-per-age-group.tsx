import { NlTestedPerAgeGroupValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useMemo } from 'react';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import {
  TooltipList,
  TooltipSeriesList,
} from '~/components-styled/time-series-chart/components/tooltip/tooltip-series-list';
import { LineSeriesDefinition } from '~/components-styled/time-series-chart/logic';
import { useIntl } from '~/intl';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
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

  const underReportedDateStart = getBoundaryDateStartUnix(values, 7);

  /* @TODO Always enabled is temporary logic pending on new UX */
  const alwayEnabled = useMemo(() => {
    return ['infected_overall_per_100k'];
  }, []);

  /* Enrich config with dynamic data / locale */
  const ageGroupBaseConfig: LineSeriesDefinition<NlTestedPerAgeGroupValue>[] = useMemo(() => {
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

  /* Filter for each config group */
  const ageGroupChartConfig = useMemo(() => {
    const compareList = list.concat(...alwayEnabled);
    return ageGroupBaseConfig.filter(
      (item) =>
        compareList.includes(item.metricProperty) ||
        compareList.length === alwayEnabled.length
    );
  }, [ageGroupBaseConfig, list, alwayEnabled]);

  const ageGroupLegendConfig = useMemo(() => {
    return ageGroupBaseConfig.filter(
      (item) => !alwayEnabled.includes(item.metricProperty)
    );
  }, [ageGroupBaseConfig, alwayEnabled]);

  const alwaysEnabledConfig = useMemo(() => {
    return ageGroupBaseConfig.filter((item) =>
      alwayEnabled.includes(item.metricProperty)
    );
  }, [ageGroupBaseConfig, alwayEnabled]);

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
          <div css={css({ [`${TooltipList}`]: { columns: tooltipColumns } })}>
            <TooltipSeriesList data={data} />
          </div>
        )}
        dataOptions={{
          timespanAnnotations: [
            {
              start: underReportedDateStart,
              end: Infinity,
              label: text.line_chart_legend_inaccurate_label,
              shortLabel: text.tooltip_labels.inaccurate,
            },
          ],
        }}
      />
      <AgeGroupLegend
        seriesConfig={ageGroupLegendConfig}
        alwaysEnabledConfig={alwaysEnabledConfig}
        ageGroupSelection={list}
        onToggleAgeGroup={toggle}
        onReset={clear}
      />
    </>
  );
}
