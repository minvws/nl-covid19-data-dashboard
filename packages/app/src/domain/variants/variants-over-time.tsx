import { assert } from '@corona-dashboard/common';
import { InteractiveLegend } from '~/components/interactive-legend';
import { Legend, LegendItem } from '~/components/legend';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { LineSeriesDefinition } from '~/components/time-series-chart/logic';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { VariantChartValue } from '~/static-props/variants/get-variant-chart-data';
import { colors } from '~/style/theme';
import { getBoundaryDateStartUnix } from '~/utils/get-trailing-date-range';
import { useList } from '~/utils/use-list';

interface VariantsOverTimeProps {
  values: VariantChartValue[];
}

export function VariantsOverTime({ values }: VariantsOverTimeProps) {
  const { siteText } = useIntl();
  const text = siteText.covid_varianten.varianten_over_tijd;

  const { list, toggle, clear } = useList<string>();

  const underReportedDateStart = getBoundaryDateStartUnix(values, 1);
  if (!values.length) {
    return null;
  }

  const variantNames = Object.keys(values[0])
    .filter((x) => x.endsWith('_percentage'))
    .map((x) => x.slice(0, x.indexOf('_')));

  const seriesConfig = variantNames.map<
    LineSeriesDefinition<VariantChartValue>
  >((x) => {
    const color = (colors.data.variants as Record<string, string>)[x];
    const label = (
      siteText.covid_varianten.varianten as Record<string, string>
    )[x];
    assert(color, `No color specified for variant called "${x}"`);
    assert(label, `No label specified for variant called "${x}"`);

    return {
      metricProperty: `${x}_percentage`,
      type: 'line',
      shape: 'line',
      color,
      label,
    };
  });

  const underReportedLegendItem: LegendItem = {
    shape: 'square',
    color: colors.data.underReported,
    label: text.legend_niet_compleet_label,
  };

  const alwayEnabled: keyof VariantChartValue | [] = [];

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
        accessibility={{ key: 'variants_over_time_chart' }}
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
