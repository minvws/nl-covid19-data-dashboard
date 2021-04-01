import { NlVaccineDeliveryPerSupplier } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useState } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { ChartTile } from '~/components-styled/chart-tile';
import { RadioGroup } from '~/components-styled/radio-group';
import { StackedChart } from '~/components-styled/stacked-chart';
import { Text } from '~/components-styled/typography';
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

  /**
   * The timeframe `recent_and_coming` should display 4 delivered values
   * and 4 expected values. We'll find the index of the first estimated value
   * and slice values based on that index.
   */
  const estimateIndex = data.values.findIndex((value) => value.is_estimate);

  const timeframeOptions = [
    {
      label: intl.siteText.charts.time_controls.all,
      value: 'all',
    },
    {
      label:
        intl.siteText.vaccinaties.grafiek_leveringen
          .timeframe_recent_en_verwacht,
      value: 'recent_and_coming',
    },
  ];

  const productNames =
    intl.siteText.vaccinaties.data.vaccination_chart.product_names;

  return (
    <ChartTile
      title={text.titel}
      metadata={{
        date: data.last_value.date_of_report_unix,
        source: intl.siteText.vaccinaties.bronnen.rivm,
      }}
      description={
        <Box display="flex" flexDirection={{ _: 'column', md: 'row' }}>
          <Box flex={1} pr={{ md: 2 }}>
            <Text>{text.omschrijving}</Text>
          </Box>
          <Box css={css({ '> *': { whiteSpace: 'nowrap' } })}>
            <RadioGroup
              value={timeframe}
              onChange={(x) => setTimeframe(x)}
              items={timeframeOptions}
            />
          </Box>
        </Box>
      }
    >
      <StackedChart
        values={
          timeframe === 'all'
            ? data.values
            : data.values.slice(estimateIndex - 4, estimateIndex + 4)
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
        ].filter(isDefined)}
        expectedLabel={
          intl.siteText.vaccinaties.data.vaccination_chart.legend.expected
        }
      />
    </ChartTile>
  );
}
