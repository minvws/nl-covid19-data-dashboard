import {
  formatNumber,
  isDateSpanValue,
  NlVaccineAdministeredEstimateValue,
  NlVaccineAdministeredValue,
  NlVaccineDeliveryEstimateValue,
  NlVaccineDeliveryValue,
} from '@corona-dashboard/common';
import styled from 'styled-components';
import { HoverPoint } from '~/components-styled/area-chart/components/marker';
import { TimestampedTrendValue } from '~/components-styled/area-chart/logic';
import { Text } from '~/components-styled/typography';
import { AllLanguages } from '~/locale/APP_LOCALE';
import { formatDateFromSeconds } from '~/utils/formatDate';

export type TooltipValue = (
  | NlVaccineDeliveryValue
  | NlVaccineDeliveryEstimateValue
  | NlVaccineAdministeredValue
  | NlVaccineAdministeredEstimateValue
) &
  TimestampedTrendValue;

export function createDeliveryTooltipFormatter(text: AllLanguages) {
  return (values: HoverPoint<TooltipValue>[]) => {
    return formatVaccinationsTooltip(values, text);
  };
}

function formatVaccinationsTooltip(
  values: HoverPoint<TooltipValue>[],
  text: AllLanguages
) {
  if (!values.length) {
    return null;
  }

  const data = values[0].data;

  if (isDateSpanValue(data)) {
    const dateEndString = formatDateFromSeconds(
      data.date_end_unix,
      'day-month'
    );
    return (
      <>
        <Text as="span" fontWeight="bold">
          {dateEndString}
        </Text>
        <TooltipList>
          {values.map((value) => (
            <TooltipListItem
              key={`${value.label}`}
              color={value.color ?? 'black'}
            >
              <TooltipValueContainer>
                {formatLabel(value.label, text)}:{' '}
                <strong>{formatValue(value)}</strong>
              </TooltipValueContainer>
            </TooltipListItem>
          ))}
        </TooltipList>
      </>
    );
  }

  throw new Error(
    `Invalid value passed to format tooltip function: ${JSON.stringify(values)}`
  );
}

function formatLabel(labelKey: string | undefined, text: AllLanguages) {
  const labelText = labelKey
    ? (text.vaccinaties.data.vaccination_chart.product_names as any)[labelKey]
    : undefined;
  return labelText ?? labelKey;
}

function formatValue(value: HoverPoint<TooltipValue>) {
  const data: any = value.data;
  if (data.total) {
    return formatNumber(data.total);
  }
  return formatNumber(data[value.label as string]);
}

const TooltipList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

interface TooltipListItemProps {
  color: string;
}

const TooltipListItem = styled.li<TooltipListItemProps>`
  display: flex;
  align-items: center;

  &::before {
    content: '';
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background: ${(props) => props.color};
    margin-right: 0.5em;
    flex-shrink: 0;
  }
`;

const TooltipValueContainer = styled.span`
  display: flex;
  width: 100%;
  min-width: 150px;
  justify-content: space-between;
`;
