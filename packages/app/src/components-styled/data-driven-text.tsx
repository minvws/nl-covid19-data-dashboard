import { numberFormat } from "highcharts";
import { get } from "lodash";
import { isDefined } from "ts-is-present";
import { National } from "~/types/data";
import { assert } from "~/utils/assert";
import { formatDateFromMilliseconds } from "~/utils/formatDate";
import { formatNumber } from "~/utils/formatNumber";
import { getLastFilledValue } from "~/utils/get-last-filled-value";
import { DifferenceIndicator } from "./difference-indicator";

interface DataDrivenTextProps {
  data: National;
  differenceKey: string;
  metricName: string;
  metricProperty: string;
}

export function DataDrivenText({ data, differenceKey, metricName, metricProperty }: DataDrivenTextProps) {

  const lastValue =
    metricProperty === 'hospital_moving_avg_per_region'
      ? getLastFilledValue(data, metricName)
      : get(data, [(metricName as unknown) as string, 'last_value']);

  const propertyValue = metricProperty && lastValue[metricProperty];

  assert(
    isDefined(propertyValue),
    `Missing value for metric property ${[
      metricName,
      'last_value',
      metricProperty,
    ]
      .filter(isDefined)
      .join(':')}`
  );

  const differenceValue = differenceKey
    ? get(data, ['difference', (differenceKey as unknown) as string])
    : undefined;

  assert(
    isDefined(differenceValue),
    `Missing value for difference:${differenceKey}`
  );

  return <p>
    {formatDateFromMilliseconds(differenceValue.new_date_of_report_unix, 'relative')} zijn <strong>{formatNumber(propertyValue)}</strong> nieuwe positieve tests gemeld.
    Dat zijn er <DifferenceIndicator value={differenceValue} format="inline" /> dan {formatDateFromMilliseconds(differenceValue.old_date_of_report_unix, 'relative')}
  </p>
}
