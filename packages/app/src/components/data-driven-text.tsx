import {
  DifferenceDecimal,
  DifferenceInteger,
  Municipal,
  National,
  Regionaal,
} from '@corona-dashboard/common';
import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
import { useIntl } from '~/intl';
import { assert } from '~/utils/assert';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { InlineDifference } from './difference-indicator';
import { RelativeDate } from './relative-date';
import { Text } from './typography';

type DataKeys = keyof National | keyof Regionaal | keyof Municipal;

/**
 * This type ensures that if a metricName of type keyof National is assigned,
 * the data property HAS to be of type a Pick of National that includes the
 * 'difference' key plus the key that was assigned to metricName.
 *
 * So, if metricName is 'vaccine_stock' then data needs to be assigned with
 * Pick<National, 'difference'|'vaccine_stock'>
 *
 * @TODO These types don't seem to work, as we need to use Lodash get plus
 * casting to get to them. Normal accessors give type errors. Lodash get is very
 * forgiving because it will work on any data structure.
 *
 */
type DataFile<T> = T extends keyof National
  ? Pick<National, 'difference' | T>
  : T extends keyof Regionaal
  ? Pick<Regionaal, 'difference' | T>
  : T extends keyof Municipal
  ? Pick<Municipal, 'difference' | T>
  : never;
interface DataDrivenTextProps<T extends DataKeys, K = DataFile<T>> {
  data: K;
  differenceKey: string;
  metricName: T;
  metricProperty: string;
  valueTexts: PluralizationTexts;
  differenceText: string;
}

export function DataDrivenText<T extends DataKeys, K = DataFile<T>>({
  data,
  differenceKey,
  metricName,
  metricProperty,
  valueTexts,
  differenceText: differenceTexts,
}: DataDrivenTextProps<T, K>) {
  const { siteText, formatNumber } = useIntl();

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

  const differenceValue = differenceKey
    ? (get(data, ['difference', differenceKey]) as
        | DifferenceInteger
        | DifferenceDecimal)
    : undefined;

  assert(
    isDefined(differenceValue),
    `Missing value for difference:${differenceKey}`
  );

  const baseText = getPluralizedText(valueTexts, propertyValue);

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
      {replaceComponentsInText(differenceTexts, {
        differenceTrend: <InlineDifference value={differenceValue} />,
        differenceAverage: (
          <strong>{formatNumber(differenceValue.old_value)}</strong>
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
