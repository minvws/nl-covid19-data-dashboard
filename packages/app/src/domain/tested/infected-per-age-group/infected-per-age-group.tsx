import { useMemo } from 'react';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { colors } from '~/style/theme';
import { AgeGroupLegend } from './age-group-legend';
import { useAgeGroupSelection } from './use-age-group-selection';

interface InfectedPerAgeGroup {
  values: any[];
  timeframe: any;
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

  const ageGroupSeries = useMemo(() => {
    console.log('ageGroupSeries');
    const ageGroups = [
      'infected_age_0_9_per_100k',
      'infected_age_10_19_per_100k',
      'infected_age_20_29_per_100k',
      'infected_age_30_39_per_100k',
      'infected_age_40_49_per_100k',
      'infected_age_50_59_per_100k',
      'infected_age_60_69_per_100k',
      'infected_age_70_79_per_100k',
      'infected_age_80_89_per_100k',
      'infected_age_90_plus_per_100k',
    ];
    return ageGroups.map((ageGroup) => ({
      type: 'line',
      metricProperty: ageGroup,
      label: ageGroup,
      color:
        ageGroupSelection.includes(ageGroup) || ageGroupSelection.length === 0
          ? colors.data.primary
          : 'rgba(160, 160, 160, 0.5)',
    }));
  }, [ageGroupSelection]);

  return (
    <>
      <TimeSeriesChart
        values={values}
        timeframe={timeframe}
        seriesConfig={[
          ...ageGroupSeries,
          // {
          //   type: 'invisible',
          //   metricProperty: 'infected',
          //   label: siteText.common.totaal,
          // },
        ]}
        dataOptions={{
          isPercentage: true,
        }}
        onSeriesClick={(config) => toggleAgeGroup(config.label)}
        disableLegend
      />
      <AgeGroupLegend
        seriesConfig={[
          ...ageGroupSeries,
          // {
          //   type: 'invisible',
          //   metricProperty: 'infected',
          //   label: siteText.common.totaal,
          // },
        ]}
        ageGroupSelection={ageGroupSelection}
        onToggleAgeGroup={toggleAgeGroup}
        onReset={resetAgeGroupSelection}
      />
    </>
  );
}
