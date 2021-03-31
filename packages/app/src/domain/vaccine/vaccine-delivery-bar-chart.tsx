import {
  NlVaccineDeliveryPerSupplier,
  NlVaccineDeliveryPerSupplierValue,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useState } from 'react';
import { Box } from '~/components-styled/base';
import {
  ChartTile,
  ChartTileWithTimeframe,
} from '~/components-styled/chart-tile';
import { RadioGroup } from '~/components-styled/radio-group';
import { StackedChart } from '~/components-styled/stacked-chart';
import { Text } from '~/components-styled/typography';
import { useIntl } from '~/intl';
import { AllLanguages } from '~/locale';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

interface VaccineDeliveryBarChartProps {
  data: NlVaccineDeliveryPerSupplier;
  siteText: AllLanguages;
}

type Timeframe = 'all' | 'delivered_and_expected';

export function VaccineDeliveryBarChart({
  data,
  siteText,
}: VaccineDeliveryBarChartProps) {
  const intl = useIntl();
  const text = siteText.vaccinaties.grafiek_leveringen;
  const [timeframe, setTimeframe] = useState<Timeframe>(
    'delivered_and_expected'
  );
  const isEstimateIndex = data.values.findIndex((value) => value.is_estimate);

  const timeframeOptions = [
    {
      label: intl.siteText.charts.time_controls.all,
      value: 'all',
    },
    {
      label:
        intl.siteText.vaccinaties.grafiek_leveringen
          .timeframe_recent_en_verwacht,
      value: 'delivered_and_expected',
    },
  ];

  return (
    <ChartTile
      title={replaceVariablesInText(text.titel, {
        weekNumber: data.last_value.week_number,
        date: intl.formatDateFromSeconds(
          data.last_value.date_end_unix,
          'day-month'
        ),
      })}
      metadata={{
        date: data.last_value.date_of_report_unix,
        source: siteText.vaccinaties.bronnen.rivm,
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
            : data.values.slice(isEstimateIndex - 4, isEstimateIndex + 4)
        }
        valueAnnotation={siteText.waarde_annotaties.x_100k}
        formatTickValue={(x) => `${x / 100_000}`}
        config={[
          {
            metricProperty: 'bio_n_tech_pfizer',
            color: colors.data.vaccines.bio_n_tech_pfizer,
            label: 'BioNTech/Pfizer',
          },
          {
            metricProperty: 'moderna',
            color: colors.data.vaccines.moderna,
            label: 'Moderna',
          },
          {
            metricProperty: 'astra_zeneca',
            color: colors.data.vaccines.astra_zeneca,
            label: 'AstraZeneca',
          },
        ]}
        expectedLabel={
          siteText.vaccinaties.data.vaccination_chart.legend.expected
        }
      />
    </ChartTile>
  );
}
