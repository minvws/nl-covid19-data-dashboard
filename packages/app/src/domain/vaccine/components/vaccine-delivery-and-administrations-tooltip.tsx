import { Box } from '~/components/base';
import { TooltipData } from '~/components/time-series-chart/components';
import { TooltipSeriesListContainer } from '~/components/time-series-chart/components/tooltip/tooltip-series-list-container';
import { TooltipSeriesListItems } from '~/components/time-series-chart/components/tooltip/tooltip-series-list-items';
import { LineSeriesDefinition } from '~/components/time-series-chart/logic/series';
import { VaccineDeliveryAndAdministrationsValue } from '../data-selection/select-delivery-and-administration-data';

export function VaccineDeliveryAndAdministrationsTooltip<
  T extends VaccineDeliveryAndAdministrationsValue
>({ data }: { data: TooltipData<T> }) {
  const { value, configIndex, config, options, metricPropertyFormatters } =
    data;

  const firstConfig = config
    .filter((x): x is LineSeriesDefinition<T> => x.type === 'line')
    .find((x) => x.metricProperty === 'total');

  const otherConfigs = config.filter((x) => x !== firstConfig);

  if (!firstConfig || !otherConfigs.length) {
    return null;
  }

  const configs = [firstConfig, ...otherConfigs];

  return (
    <TooltipSeriesListContainer
      {...data}
      timespanAnnotation={data.timespanAnnotation}
    >
      <Box spacing={1}>
        <TooltipSeriesListItems
          value={value}
          config={configs}
          configIndex={configIndex}
          options={options}
          metricPropertyFormatters={metricPropertyFormatters}
        />
      </Box>
    </TooltipSeriesListContainer>
  );
}
