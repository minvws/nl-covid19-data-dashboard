import {
  colors,
  NlVaccineDeliveryPerSupplier,
  NlVaccineDeliveryPerSupplierValue,
} from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { Markdown } from '~/components/markdown';
import {
  StackedBarTooltipData,
  StackedChart,
} from '~/components/stacked-chart';
import {
  TooltipData,
  TooltipFormatter,
} from '~/components/time-series-chart/components';
import { TooltipSeriesList } from '~/components/time-series-chart/components/tooltip/tooltip-series-list';
import { useIntl } from '~/intl';

export function VaccineDeliveryBarChart({
  data,
}: {
  data: NlVaccineDeliveryPerSupplier;
}) {
  const intl = useIntl();
  const text = intl.siteText.pages.vaccinationsPage.nl.grafiek_leveringen;

  data.values = data.values.filter((x) => !x.is_estimate);

  const productNames =
    intl.siteText.pages.vaccinationsPage.nl.data.vaccination_chart
      .product_names;

  const formatTooltip: TooltipFormatter<
    NlVaccineDeliveryPerSupplierValue & StackedBarTooltipData
  > = (
    context: TooltipData<
      NlVaccineDeliveryPerSupplierValue & StackedBarTooltipData
    >
  ) => {
    return <TooltipSeriesList data={context} />;
  };

  return (
    <ChartTile
      title={text.titel}
      metadata={{
        source: intl.siteText.pages.vaccinationsPage.nl.bronnen.rivm,
      }}
    >
      <Box
        mb={3}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        spacing={3}
      >
        <Box maxWidth={560}>
          <Markdown content={text.omschrijving} />
        </Box>
      </Box>

      <StackedChart
        accessibility={{
          key: 'vaccine_delivery_bar_chart',
          features: ['keyboard_bar_chart'],
        }}
        values={data.values}
        valueAnnotation={intl.siteText.waarde_annotaties.x_100k}
        formatTickValue={(x) => `${x / 100_000}`}
        config={[
          {
            metricProperty: 'bio_n_tech_pfizer' as const,
            color: colors.data.vaccines.bio_n_tech_pfizer,
            label: productNames.pfizer,
          },
          {
            metricProperty: 'moderna' as const,
            color: colors.data.vaccines.moderna,
            label: productNames.moderna,
          },
          {
            metricProperty: 'astra_zeneca' as const,
            color: colors.data.vaccines.astra_zeneca,
            label: productNames.astra_zeneca,
          },
          'janssen' in data.last_value
            ? {
                metricProperty: 'janssen' as const,
                color: colors.data.vaccines.janssen,
                label: productNames.janssen,
              }
            : undefined,
          {
            metricProperty: 'total' as const,
            color: 'transparent',
            type: 'invisible',
            label: text.totaal,
          },
        ].filter(isDefined)}
        formatTooltip={formatTooltip}
      />
    </ChartTile>
  );
}
