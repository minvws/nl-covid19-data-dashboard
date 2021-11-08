import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
import { RelativeDate } from '~/components/relative-date';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { assert } from '~/utils/assert';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { Content, DataFile, DataKeys } from '..';
import { getPluralizedText } from '../logic/get-pluralized-text';

export function Metric<T extends DataKeys, K = DataFile<T>>({
  data,
  metricName,
  metricProperty,
  differenceKey,
  text,
  additionalData,
}: Extract<Content<T>, { type: 'metric' }> & { data: K }) {
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

  const baseText = getPluralizedText(text, propertyValue);

  return (
    <>
      {replaceComponentsInText(baseText, {
        newDate: (
          <RelativeDate
            dateInSeconds={differenceValue.new_date_unix}
            isCapitalized={baseText.indexOf('{{newDate}}') === 0}
            absoluteDateTemplate={siteText.common.absolute_date_template}
          />
        ),
        propertyValue: (
          <InlineText fontWeight="bold">
            {formatNumber(propertyValue)}
          </InlineText>
        ),
        ...(additionalData || {}),
      })}
    </>
  );
}
