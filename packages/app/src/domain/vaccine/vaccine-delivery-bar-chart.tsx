import { colors, ArchivedNlVaccineDeliveryPerSupplier, ArchivedNlVaccineDeliveryPerSupplierValue } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { Markdown } from '~/components/markdown';
import { StackedBarTooltipData, StackedChart } from '~/components/stacked-chart';
import { TooltipData, TooltipFormatter } from '~/components/time-series-chart/components';
import { TooltipSeriesList } from '~/components/time-series-chart/components/tooltip/tooltip-series-list';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { space } from '~/style/theme';

export function VaccineDeliveryBarChart({ data, text }: { data: ArchivedNlVaccineDeliveryPerSupplier; text: SiteText['pages']['vaccinations_page']['nl'] }) {
  const { commonTexts } = useIntl();
  data.values = data.values.filter((x) => !x.is_estimate);

  const productNames = text.data.vaccination_chart.product_names;

  const formatTooltip: TooltipFormatter<ArchivedNlVaccineDeliveryPerSupplierValue & StackedBarTooltipData> = (
    context: TooltipData<ArchivedNlVaccineDeliveryPerSupplierValue & StackedBarTooltipData>
  ) => {
    return <TooltipSeriesList data={context} />;
  };

  return (
    <ChartTile
      title={text.grafiek_leveringen.titel}
      metadata={{
        source: text.bronnen.rivm,
      }}
    >
      <Box marginBottom={space[3]} display="flex" flexDirection="column" alignItems="flex-start" spacing={3}>
        <Box maxWidth="560px">
          <Markdown content={text.grafiek_leveringen.omschrijving} />
        </Box>
      </Box>

      <StackedChart
        accessibility={{
          key: 'vaccine_delivery_bar_chart',
          features: ['keyboard_bar_chart'],
        }}
        values={data.values}
        valueAnnotation={commonTexts.waarde_annotaties.x_100k}
        formatTickValue={(x) => `${x / 100_000}`}
        config={[
          {
            metricProperty: 'bio_n_tech_pfizer' as const,
            color: colors.vaccines.bio_n_tech_pfizer,
            label: productNames.pfizer,
          },
          {
            metricProperty: 'moderna' as const,
            color: colors.vaccines.moderna,
            label: productNames.moderna,
          },
          {
            metricProperty: 'astra_zeneca' as const,
            color: colors.vaccines.astra_zeneca,
            label: productNames.astra_zeneca,
          },
          'janssen' in data.last_value
            ? {
                metricProperty: 'janssen' as const,
                color: colors.vaccines.janssen,
                label: productNames.janssen,
              }
            : undefined,
          {
            metricProperty: 'total' as const,
            color: 'transparent',
            type: 'invisible',
            label: text.grafiek_leveringen.totaal,
          },
        ].filter(isDefined)}
        formatTooltip={formatTooltip}
      />
    </ChartTile>
  );
}
