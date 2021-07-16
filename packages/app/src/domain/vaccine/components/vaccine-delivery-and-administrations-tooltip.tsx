import { TooltipData } from '~/components/time-series-chart/components';
import { TooltipSeriesListContainer } from '~/components/time-series-chart/components/tooltip/tooltip-series-list-container';
import { TooltipSeriesListItems } from '~/components/time-series-chart/components/tooltip/tooltip-series-list-items';
import { LineSeriesDefinition } from '~/components/time-series-chart/logic/series';
import { Heading } from '~/components/typography';
import { useIntl } from '~/intl';
import { VaccineDeliveryAndAdministrationsValue } from '../data-selection/select-delivery-and-administration-data';

export function VaccineDeliveryAndAdministrationsTooltip<
  T extends VaccineDeliveryAndAdministrationsValue
>({ data }: { data: TooltipData<T> }) {
  const { siteText } = useIntl();
  const { value, configIndex, config, options, metricPropertyFormatters } =
    data;

  const isEstimate =
    data.timespanAnnotation?.fill === 'hatched' &&
    data.timespanAnnotation.start !== data.value.date_unix;

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
      // do not display the timespan annotation label in the tooltip
      timespanAnnotation={undefined}
    >
      <TooltipSeriesListItems
        value={value}
        config={[
          {
            ...firstConfig,
            label: isEstimate
              ? siteText.vaccinaties.data.vaccination_chart.estimated
              : siteText.vaccinaties.data.vaccination_chart.delivered,
          },
        ]}
        configIndex={configIndex}
        options={options}
        metricPropertyFormatters={metricPropertyFormatters}
      />

      <Heading level={5} my={1}>
        {!isEstimate
          ? siteText.vaccinaties.data.vaccination_chart.doses_administered
          : siteText.vaccinaties.data.vaccination_chart
              .doses_administered_estimated}
      </Heading>

      <TooltipSeriesListItems
        value={value}
        config={otherConfigs}
        configIndex={configIndex}
        options={options}
        metricPropertyFormatters={metricPropertyFormatters}
      />
    </TooltipSeriesListContainer>
  );
}
