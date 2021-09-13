import {
  NlVaccineDeliveryPerSupplier,
  NlVaccineDeliveryPerSupplierValue,
} from '@corona-dashboard/common';
import { useState } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { RadioGroup } from '~/components/radio-group';
import {
  StackedBarTooltipData,
  StackedChart,
} from '~/components/stacked-chart';
import {
  TooltipData,
  TooltipFormatter,
} from '~/components/time-series-chart/components';
import { TooltipSeriesList } from '~/components/time-series-chart/components/tooltip/tooltip-series-list';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';

type Timeframe = 'all' | 'recent_and_coming';

export function VaccineDeliveryBarChart({
  data,
}: {
  data: NlVaccineDeliveryPerSupplier;
}) {
  const intl = useIntl();
  const text = intl.siteText.vaccinaties.grafiek_leveringen;
  const [timeframe, setTimeframe] = useState<Timeframe>('recent_and_coming');

  data.values = data.values.filter((x) => !x.is_estimate);

  /**
   * The timeframe `recent_and_coming` should display 4 delivered values
   * and 4 expected values. We'll find the index of the first estimated value
   * and slice values based on that index.
   */
  // const estimateIndex = data.values.findIndex((value) => value.is_estimate);

  const timeframeOptions = [
    {
      label: intl.siteText.charts.time_controls.all,
      value: 'all',
    },
    {
      label: text.timeframe_recent_en_verwacht,
      value: 'recent_and_coming',
    },
  ];

  const productNames =
    intl.siteText.vaccinaties.data.vaccination_chart.product_names;

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
        source: intl.siteText.vaccinaties.bronnen.rivm,
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
          <Text>{text.omschrijving}</Text>
        </Box>

        <RadioGroup
          value={timeframe}
          onChange={(x) => setTimeframe(x as Timeframe)}
          items={timeframeOptions}
        />
      </Box>

      <StackedChart
        accessibility={{
          key: 'vaccine_delivery_bar_chart',
          features: ['keyboard_bar_chart'],
        }}
        values={
          timeframe === 'all'
            ? data.values
            : data.values.slice(data.values.length - 6)
        }
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
