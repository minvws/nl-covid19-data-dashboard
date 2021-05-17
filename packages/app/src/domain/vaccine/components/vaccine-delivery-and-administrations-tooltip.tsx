import styled from 'styled-components';
import { Spacer } from '~/components/base';
import { TooltipData } from '~/components/time-series-chart/components';
import {
  LineSeriesDefinition,
  SeriesConfig,
  StackedAreaSeriesDefinition,
} from '~/components/time-series-chart/logic/series';
import { Heading } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { AllLanguages } from '~/locale';
import { VaccineDeliveryAndAdministrationsValue } from '../data-selection/selected-delivery-and-administration-data';

function isLineConfig(
  input: SeriesConfig<VaccineDeliveryAndAdministrationsValue>[number]
): input is LineSeriesDefinition<VaccineDeliveryAndAdministrationsValue> {
  return input.type === 'line';
}

function isStackedConfig(
  input: SeriesConfig<VaccineDeliveryAndAdministrationsValue>[number]
): input is StackedAreaSeriesDefinition<VaccineDeliveryAndAdministrationsValue> {
  return input.type === 'stacked-area';
}

export function VaccineDeliveryAndAdministrationsTooltip({
  data,
  estimateRange,
}: {
  data: TooltipData<VaccineDeliveryAndAdministrationsValue>;
  estimateRange: [number, number];
}) {
  const { siteText, formatNumber, formatDateFromSeconds } = useIntl();

  const isEstimate =
    data.value.date_start_unix >= estimateRange[0] &&
    data.value.date_end_unix <= estimateRange[1];

  const firstValue = data.value.total_delivered;
  const firstConfig = data.config
    .filter(isLineConfig)
    .find((x) => x.metricProperty === 'total_delivered');

  const otherConfigs = data.config.filter(isStackedConfig);

  if (!firstConfig || !otherConfigs.length) {
    return null;
  }

  const dateEndString = formatDateFromSeconds(
    data.value.date_end_unix,
    'day-month'
  );

  return (
    <>
      <VisuallyHidden>{dateEndString}</VisuallyHidden>
      <TooltipList>
        <TooltipListItem>
          <span>
            <ColorIndicator color={firstConfig.color} />
            {isEstimate
              ? siteText.vaccinaties.data.vaccination_chart.estimated
              : siteText.vaccinaties.data.vaccination_chart.delivered}
            :
          </span>
          <TooltipValueContainer>
            {formatNumber(firstValue)}
          </TooltipValueContainer>
        </TooltipListItem>
      </TooltipList>

      <Heading level={5} my={1}>
        {!isEstimate
          ? siteText.vaccinaties.data.vaccination_chart.doses_administered
          : siteText.vaccinaties.data.vaccination_chart
              .doses_administered_estimated}
      </Heading>

      <TooltipList>
        {otherConfigs.map((config) => (
          <TooltipListItem key={config.label}>
            <span>
              <ColorIndicator color={config.color} />
              {formatLabel(config.label, siteText)}:
            </span>
            <TooltipValueContainer>
              <strong>
                {formatNumber(data.value[config.metricProperty] || 0)}
              </strong>
            </TooltipValueContainer>
          </TooltipListItem>
        ))}

        <Spacer mb={1} />
        <TooltipListItem>
          <span>
            <ColorIndicator color="transparent" />
            {
              siteText.vaccinaties.data.vaccination_chart
                .doses_administered_total
            }
            :
          </span>
          <TooltipValueContainer>
            <strong>{formatNumber(data.value.total)}</strong>
          </TooltipValueContainer>
        </TooltipListItem>
      </TooltipList>
    </>
  );
}

function formatLabel(labelKey: string | undefined, text: AllLanguages) {
  const labelText = labelKey
    ? (text.vaccinaties.data.vaccination_chart.product_names as any)[labelKey]
    : undefined;
  return labelText ?? labelKey;
}

const TooltipList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ColorIndicator = styled.span<{
  color?: string;
}>`
  &::before {
    content: '';
    display: ${(x) => (x.color ? 'inline-block' : 'none')};
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background: ${(x) => x.color || 'black'};
    margin-right: 0.5em;
    flex-shrink: 0;
  }
`;

const TooltipListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TooltipValueContainer = styled.span`
  font-weight: bold;
  margin-left: 1em;
`;
