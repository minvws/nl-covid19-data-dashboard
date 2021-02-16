import {
  formatNumber,
  isDateSpanValue,
  isDateValue,
  NlVaccineAdministeredEstimateValue,
  NlVaccineAdministeredValue,
  NlVaccineDeliveryEstimateValue,
  NlVaccineDeliveryValue,
} from '@corona-dashboard/common';
import { Box } from '~/components-styled/base';
import { HoverPoint } from '~/components-styled/line-chart/components';
import { TimestampedTrendValue } from '~/components-styled/line-chart/logic';
import { Text } from '~/components-styled/typography';
import { AllLanguages } from '~/locale/APP_LOCALE';
import {
  formatDateFromMilliseconds,
  formatDateFromSeconds,
} from '~/utils/formatDate';

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

  if (isDateValue(data)) {
    return (
      <Box>
        <Text fontWeight="bold">
          {`${formatDateFromMilliseconds(data.__date.getTime())}: `}
        </Text>
        {values.map((value) => (
          <Box key={value.data.__value}>{formatNumber(value.data.__value)}</Box>
        ))}
      </Box>
    );
  } else if (isDateSpanValue(data)) {
    const dateStartString = formatDateFromSeconds(
      data.date_start_unix,
      'short'
    );
    const dateEndString = formatDateFromSeconds(data.date_end_unix, 'short');
    return (
      <Box>
        <Text fontWeight="bold">
          {`${dateStartString} - ${dateEndString}: `}
        </Text>
        {values.map((value) => (
          <Box key={`${value.label}`}>
            {formatLabel(value.label, text)}: {formatValue(value)}
          </Box>
        ))}
      </Box>
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
