import { NlTestedPerAgeGroupValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useMemo } from 'react';
import styled from 'styled-components';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { TooltipChildren } from '~/components-styled/time-series-chart/components';
import { LineSeriesDefinition } from '~/components-styled/time-series-chart/logic';
import { useIntl } from '~/intl';
import { AgeGroupLegend } from './components/age-group-legend';
import { SERIES_CONFIG } from './series-config';
import { useAgeGroupSelection } from './logic/use-age-group-selection';

interface InfectedPerAgeGroup {
  values: NlTestedPerAgeGroupValue[];
  timeframe: 'all' | '5weeks' | 'week';
}

export function InfectedPerAgeGroup({
  values,
  timeframe,
}: InfectedPerAgeGroup) {
  const {
    ageGroupSelection,
    toggleAgeGroup,
    resetAgeGroupSelection,
  } = useAgeGroupSelection();

  const { siteText } = useIntl();
  const text = siteText.infected_per_agroup;

  const ageGroupLegendConfig: (LineSeriesDefinition<NlTestedPerAgeGroupValue> & {
    isSelected: boolean;
  })[] = useMemo(() => {
    return SERIES_CONFIG.map((baseAgeGroup) => {
      const isSelected =
        ageGroupSelection.includes(baseAgeGroup.metricProperty) ||
        ageGroupSelection.length === 0;
      return {
        ...baseAgeGroup,
        type: 'line',
        label:
          baseAgeGroup.metricProperty in text.legend
            ? text.legend[baseAgeGroup.metricProperty]
            : baseAgeGroup.metricProperty,
        isSelected,
      };
    });
  }, [ageGroupSelection, text.legend]);

  const ageGroupChartConfig = useMemo(() => {
    return ageGroupLegendConfig.filter((x) => x.isSelected);
  }, [ageGroupLegendConfig]);

  /* Conditionally wrap tooltip over two columns due to amount of items */
  const tooltipColumns =
    ageGroupSelection.length === 0 || ageGroupSelection.length > 4 ? 2 : 1;
  const InfectedPerAgeGroupWrapper = styled.div(
    css({
      [`${TooltipChildren}`]: {
        columns: tooltipColumns,
      },
    })
  );

  return (
    <InfectedPerAgeGroupWrapper>
      <TimeSeriesChart
        values={values}
        timeframe={timeframe}
        seriesConfig={[...ageGroupChartConfig]}
        disableLegend
      />
      <AgeGroupLegend
        seriesConfig={[...ageGroupLegendConfig]}
        ageGroupSelection={ageGroupSelection}
        onToggleAgeGroup={toggleAgeGroup}
        onReset={resetAgeGroupSelection}
      />
    </InfectedPerAgeGroupWrapper>
  );
}
