import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
import { National } from '~/types/data';
import { assert } from '~/utils/assert';
import { formatNumber } from '~/utils/formatNumber';
import { getLastFilledValue } from '~/utils/get-last-filled-value';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { DifferenceIndicator } from './difference-indicator';
import { RelativeDate } from './relative-date';
import { Text } from './typography';

interface DataDrivenTextProps {
  data: National;
  differenceKey: string;
  metricName: keyof National;
  metricProperty: string;
  valueTexts: PluralizationTexts;
  differenceTexts: PluralizationTexts;
}

export function DataDrivenText({
  data,
  differenceKey,
  metricName,
  metricProperty,
  valueTexts,
  differenceTexts,
}: DataDrivenTextProps) {
  // @Todo move to a lastValue abstraction
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
    ? get(data, ['difference', differenceKey])
    : undefined;

  assert(
    isDefined(differenceValue),
    `Missing value for difference:${differenceKey}`
  );

  const baseText = getPluralizedText(valueTexts, propertyValue);
  const additionalText = getPluralizedText(
    differenceTexts,
    differenceValue.difference
  );

  return (
    <Text>
      {replaceComponentsInText(baseText, {
        newDate: (
          <RelativeDate
            dateInSeconds={differenceValue.new_date_of_report_unix}
            isCapitalized
          />
        ),
        propertyValue: <strong>{formatNumber(propertyValue)}</strong>,
      })}{' '}
      {replaceComponentsInText(additionalText, {
        differenceIndicator: (
          <DifferenceIndicator value={differenceValue} context="inline" />
        ),
        oldDate: (
          <RelativeDate
            dateInSeconds={differenceValue.old_date_of_report_unix}
          />
        ),
      })}
    </Text>
  );
}

type PluralizationTexts = Record<'zero' | 'singular' | 'plural', string>;

function getPluralizedText(texts: PluralizationTexts, count: number): string {
  const absoluteCount = Math.abs(count);
  if (absoluteCount === 0) {
    return texts.zero;
  }
  if (absoluteCount <= 1) {
    return texts.singular;
  }
  return texts.plural;
}
