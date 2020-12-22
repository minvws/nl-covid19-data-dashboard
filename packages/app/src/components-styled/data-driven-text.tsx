import { get } from "lodash";
import { isDefined } from "ts-is-present";
import { National } from "~/types/data";
import { assert } from "~/utils/assert";
import { formatNumber } from "~/utils/formatNumber";
import { getLastFilledValue } from "~/utils/get-last-filled-value";
import { getPluralizedText, PluralizationTexts } from "~/utils/get-pluralized-text";
import { replaceComponentsInText } from "~/utils/replace-components-in-text";
import { DifferenceIndicator } from "./difference-indicator";
import { RelativeDate } from "./relative-date";

interface DataDrivenTextProps {
  data: National;
  differenceKey: string;
  metricName: string;
  metricProperty: string;
  baseTexts: PluralizationTexts;
  additionalTexts: PluralizationTexts;
}

export function DataDrivenText({ data, differenceKey, metricName, metricProperty, baseTexts, additionalTexts }: DataDrivenTextProps) {

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

  const baseText = getPluralizedText(baseTexts, propertyValue);
  const additionalText = getPluralizedText(additionalTexts, differenceValue.difference);

  return <p>
    {replaceComponentsInText(baseText, {
      newDate: <RelativeDate dateInSeconds={differenceValue.new_date_of_report_unix} capitalize />,
      propertyValue: <strong>{formatNumber(propertyValue)}</strong>
    })}
    {' '}
    {replaceComponentsInText(additionalText, {
      differenceIndicator: <DifferenceIndicator value={differenceValue} format="inline" />,
      oldDate: <RelativeDate dateInSeconds={differenceValue.old_date_of_report_unix} />
    })}
  </p>;
}
