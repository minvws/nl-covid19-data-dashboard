import {
  DifferenceDecimal,
  DifferenceInteger,
  Municipal,
  National,
  Regionaal,
} from '@corona-dashboard/common';
import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
import siteText from '~/locale';
import { assert } from '~/utils/assert';
import { formatNumber } from '~/utils/formatNumber';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { DifferenceIndicator } from './difference-indicator';
import { RelativeDate } from './relative-date';
import { Text } from './typography';

interface DataDrivenTextProps {
  data: National | Regionaal | Municipal;
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
  const lastValue = get(data, [metricName, 'last_value']);

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

  const differenceValue:
    | DifferenceInteger
    | DifferenceDecimal
    | undefined = differenceKey
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
            dateInSeconds={differenceValue.new_date_unix}
            isCapitalized={baseText.indexOf('{{newDate}}') === 0}
            absoluteDateTemplate={siteText.common.absolute_date_template}
          />
        ),
        propertyValue: <strong>{formatNumber(propertyValue)}</strong>,
      })}{' '}
      {replaceComponentsInText(additionalText, {
        differenceIndicator: (
          <DifferenceIndicator value={differenceValue} context="inline" />
        ),
        oldDate: siteText.toe_en_afname.vorige_waarde,
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
