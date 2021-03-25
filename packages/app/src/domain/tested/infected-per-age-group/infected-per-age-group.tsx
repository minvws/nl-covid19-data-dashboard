import { NlTestedPerAgeGroupValue } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { LineSeriesDefinition } from '~/components-styled/time-series-chart/logic';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { AgeGroupLegend } from './age-group-legend';
import { useAgeGroupSelection } from './use-age-group-selection';

interface InfectedPerAgeGroup {
  values: NlTestedPerAgeGroupValue[];
  timeframe: 'all' | '5weeks' | 'week';
}

const BASE_AGE_GROUP_SERIES: {
  metricProperty: keyof NlTestedPerAgeGroupValue;
  defaultColor: string;
}[] = [
  {
    metricProperty: 'infected_age_0_9_per_100k',
    defaultColor: colors.data.multiseries.cyan,
  },
  {
    metricProperty: 'infected_age_10_19_per_100k',
    defaultColor: colors.data.multiseries.cyan_dark,
  },
  {
    metricProperty: 'infected_age_20_29_per_100k',
    defaultColor: colors.data.multiseries.yellow,
  },
  {
    metricProperty: 'infected_age_30_39_per_100k',
    defaultColor: colors.data.multiseries.yellow_dark,
  },
  {
    metricProperty: 'infected_age_40_49_per_100k',
    defaultColor: colors.data.multiseries.turquoise,
  },
  {
    metricProperty: 'infected_age_50_59_per_100k',
    defaultColor: colors.data.multiseries.turquoise_dark,
  },
  {
    metricProperty: 'infected_age_60_69_per_100k',
    defaultColor: colors.data.multiseries.orange,
  },
  {
    metricProperty: 'infected_age_70_79_per_100k',
    defaultColor: colors.data.multiseries.orange_dark,
  },
  {
    metricProperty: 'infected_age_80_89_per_100k',
    defaultColor: colors.data.multiseries.magenta,
  },
  {
    metricProperty: 'infected_age_90_plus_per_100k',
    defaultColor: colors.data.multiseries.magenta_dark,
  },
  { metricProperty: 'infected_overall_per_100k', defaultColor: colors.gray },
];

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

  const ageGroupSeriesConfig: LineSeriesDefinition<NlTestedPerAgeGroupValue>[] = useMemo(() => {
    return BASE_AGE_GROUP_SERIES.map((baseAgeGroup) => ({
      metricProperty: baseAgeGroup.metricProperty,
      type: 'line',
      label: text.legend[baseAgeGroup.metricProperty],
      color:
        ageGroupSelection.includes(baseAgeGroup.metricProperty) ||
        ageGroupSelection.length === 0
          ? baseAgeGroup.defaultColor
          : 'rgba(160, 160, 160, 0.5)',
    }));
  }, [ageGroupSelection, text.legend]);

  return (
    <>
      <TimeSeriesChart
        values={values}
        timeframe={timeframe}
        seriesConfig={[...ageGroupSeriesConfig]}
        dataOptions={{
          isPercentage: true,
        }}
        onSeriesClick={(config) => toggleAgeGroup(config.label)}
        disableLegend
      />
      <AgeGroupLegend
        seriesConfig={[...ageGroupSeriesConfig]}
        ageGroupSelection={ageGroupSelection}
        onToggleAgeGroup={toggleAgeGroup}
        onReset={resetAgeGroupSelection}
      />
    </>
  );
}
