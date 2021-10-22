import { Box } from '~/components/base';
import { TooltipData } from '~/components/time-series-chart/components';
import { TooltipSeriesListContainer } from '~/components/time-series-chart/components/tooltip/tooltip-series-list-container';
import { TooltipSeriesListItems } from '~/components/time-series-chart/components/tooltip/tooltip-series-list-items';
import { LineSeriesDefinition } from '~/components/time-series-chart/logic/series';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { VaccineDeliveryAndAdministrationsValue } from '../data-selection/select-delivery-and-administration-data';

export function VaccineDeliveryAndAdministrationsTooltip<
  T extends VaccineDeliveryAndAdministrationsValue
>({ data }: { data: TooltipData<T> }) {
  const { siteText } = useIntl();
  const { value, configIndex, config, options, metricPropertyFormatters } =
    data;

  const firstConfig = config
    .filter((x): x is LineSeriesDefinition<T> => x.type === 'line')
    .find((x) => x.metricProperty === 'total_delivered');

  const otherConfigs = config.filter((x) => x !== firstConfig);

  if (!firstConfig || !otherConfigs.length) {
    return null;
  }

  return (
    <TooltipSeriesListContainer
      {...data}
      timespanAnnotation={data.timespanAnnotation}
    >
      <Box spacing={1}>
        <TooltipSeriesListItems
          value={value}
          config={[
            {
              ...firstConfig,
              label: siteText.vaccinaties.data.vaccination_chart.delivered,
            },
          ]}
          configIndex={configIndex}
          options={options}
          metricPropertyFormatters={metricPropertyFormatters}
        />

        <Text variant="label1" fontWeight="bold">
          {siteText.vaccinaties.data.vaccination_chart.doses_administered}
        </Text>

        <TooltipSeriesListItems
          value={value}
          config={otherConfigs}
          configIndex={configIndex}
          options={options}
          metricPropertyFormatters={metricPropertyFormatters}
        />
      </Box>
    </TooltipSeriesListContainer>
  );
}
