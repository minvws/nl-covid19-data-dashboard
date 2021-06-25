import { NlVariantsValue } from '@corona-dashboard/common';
import { InteractiveLegend } from '~/components/interactive-legend';
import { Legend, LegendItem } from '~/components/legend';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { LineSeriesDefinition } from '~/components/time-series-chart/logic';
import { InlineText } from '~/components/typography';
import { BASE_SERIES_CONFIG } from '~/domain/variants/series.config';
import { Variant } from '~/domain/variants/variants-table-tile/logic/use-variants-table-data';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { useList } from '~/utils/use-list';

interface VariantsOverTimeProps {
  values: NlVariantsValue[];
}

export function VariantsOverTime({ values }: VariantsOverTimeProps) {
  const { siteText } = useIntl();
  const text = siteText.covid_varianten.varianten_over_tijd;

  const { list, toggle, clear } = useList<string>();

  const underReportedDateStart = getBoundaryDateStartUnix(values, 1);

  /* Filter all the metric properties based if they are not a concern */
  const baseConfigFiltered = BASE_SERIES_CONFIG.filter((item) => {
    const metricName = item.metricProperty.slice(
      0,
      item.metricProperty.indexOf('_')
    );
    return values[0][
      `${metricName}_is_variant_of_concern` as keyof typeof values[0]
    ];
  });

  /* Enrich config with dynamic data / locale */
  const seriesConfig: LineSeriesDefinition<NlVariantsValue>[] =
    baseConfigFiltered.map((baseAgeGroup) => {
      return {
        ...baseAgeGroup,
        type: 'line',
        shape: 'line',
        label:
          siteText.covid_varianten.varianten[
            baseAgeGroup.metricProperty.split('_')[0] as Variant
          ],
      };
    });

  const underReportedLegendItem: LegendItem = {
    shape: 'square',
    color: colors.data.underReported,
    label: text.legend_niet_compleet_label,
  };

  const alwayEnabled: keyof NlVariantsValue | [] = [];

  /* Filter for each config group */

  /**
   * Chart:
   * - when nothing selected: all items
   * - otherwise: selected items
   */
  const compareList = list.concat(alwayEnabled);
  const chartConfig = seriesConfig.filter(
    (item) =>
      compareList.includes(item.metricProperty) ||
      compareList.length === alwayEnabled.length
  );

  /* Static legend contains only the inaccurate item */
  const staticLegendItems: LegendItem[] = [underReportedLegendItem];

  return (
    <>
      <InteractiveLegend
        helpText={text.legend_help_tekst}
        selectOptions={seriesConfig}
        selection={list}
        onToggleItem={toggle}
        onReset={clear}
      />
      <InlineText fontSize="12px" fontWeight="bold" color="data.axisLabels">
        {text.percentage_gevonden_varianten}
      </InlineText>
      <TimeSeriesChart
        values={values}
        timeframe={'all'}
        seriesConfig={[
          ...chartConfig,
          {
            type: 'invisible',
            metricProperty: 'sample_size',
            label: text.tooltip_labels.totaal_monsters,
            isPercentage: false,
          },
        ]}
        disableLegend
        dataOptions={{
          isPercentage: true,
          timespanAnnotations: [
            {
              start: underReportedDateStart,
              end: Infinity,
              label: text.legend_niet_compleet_label,
              shortLabel: text.tooltip_labels.niet_compleet,
            },
          ],
        }}
      />
      <Legend items={staticLegendItems} />
    </>
  );
}
