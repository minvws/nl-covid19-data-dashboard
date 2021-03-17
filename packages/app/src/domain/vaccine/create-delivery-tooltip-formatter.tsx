import {
  formatNumber,
  NlVaccineAdministeredEstimateValue,
  NlVaccineAdministeredValue,
  NlVaccineDeliveryEstimateValue,
  NlVaccineDeliveryValue,
} from '@corona-dashboard/common';
import { Fragment } from 'react';
import styled from 'styled-components';
import { HoverPoint } from '~/components-styled/area-chart/components/marker';
import { TimestampedTrendValue } from '~/components-styled/area-chart/logic';
import { Spacer } from '~/components-styled/base';
import { InlineText, Text } from '~/components-styled/typography';
import { AllLanguages } from '~/locale/APP_LOCALE';
import { formatDateFromSeconds } from '~/utils/formatDate';

export type TooltipValue = (
  | NlVaccineDeliveryValue
  | NlVaccineDeliveryEstimateValue
  | NlVaccineAdministeredValue
  | NlVaccineAdministeredEstimateValue
) &
  TimestampedTrendValue;

export function formatVaccinationsTooltip(
  values: HoverPoint<TooltipValue>[],
  text: AllLanguages
) {
  if (!values.length) {
    return null;
  }

  /**
   * The values with administered data are index >= 1. These kind of things will
   * be solved later when converting to TimeSeriesChart.
   */
  const data = values[1].data;

  const dateEndString = formatDateFromSeconds(data.date_end_unix, 'day-month');

  return (
    <>
      <Text as="span" fontWeight="bold">
        {dateEndString}
      </Text>
      <TooltipList>
        {values.map((value) => (
          <Fragment key={value.label}>
            <TooltipListItem color={value.color ?? 'black'}>
              <TooltipValueContainer>
                {formatLabel(value.label, text)}:{' '}
                <strong>{formatValue(value)}</strong>
              </TooltipValueContainer>
            </TooltipListItem>

            {/**
             * This is a bit hacky, but when the current value's label equals
             * the 'delivered' or 'estimated' label, we'll render an extra
             * list-item as header for the vaccines which are the next values
             * in the array.
             */}
            {value.label ===
              text.vaccinaties.data.vaccination_chart.delivered && (
              <TooltipListItem>
                <InlineText mt={2} fontWeight="bold">
                  {text.vaccinaties.data.vaccination_chart.doses_administered}
                </InlineText>
              </TooltipListItem>
            )}
            {value.label ===
              text.vaccinaties.data.vaccination_chart.estimated && (
              <TooltipListItem>
                <InlineText mt={2} fontWeight="bold">
                  {
                    text.vaccinaties.data.vaccination_chart
                      .doses_administered_estimated
                  }
                </InlineText>
              </TooltipListItem>
            )}
          </Fragment>
        ))}
        <Spacer mb={1} />
        <TooltipListItem color="transparent">
          <TooltipValueContainer>
            {text.vaccinaties.data.vaccination_chart.doses_administered_total}:{' '}
            <strong>{formatNumber(data.total)}</strong>
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

function formatValue(value: HoverPoint<TooltipValue>) {
  const data: any = value.data;
  if (data[value.label as string]) {
    return formatNumber(data[value.label as string]);
  }
  return formatNumber(data.total);
}

const TooltipList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

interface TooltipListItemProps {
  color?: string;
}

const TooltipListItem = styled.li<TooltipListItemProps>`
  display: flex;
  align-items: center;

  &::before {
    content: '';
    display: ${(x) => (x.color ? 'inline-block' : 'none')};
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background: ${(x) => x.color};
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
