import {
  assert,
  DifferenceDecimal,
  DifferenceInteger,
} from '@corona-dashboard/common';
import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
import { InlineDifference } from '~/components/difference-indicator';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { Content, DataFile, DataKeys } from '..';

export function Difference<T extends DataKeys, K = DataFile<T>>(
  props: Extract<Content<T>, { type: 'difference' }> & { data: K }
) {
  const { data, text, isAmount, differenceKey, additionalData } = props;
  const { formatNumber } = useIntl();

  const differenceValue = differenceKey
    ? (get(data, ['difference', differenceKey]) as
        | DifferenceInteger
        | DifferenceDecimal)
    : undefined;

  assert(
    isDefined(differenceValue),
    `[${Difference.name}] Missing value for difference:${differenceKey}`
  );

  return (
    <>
      {replaceComponentsInText(text, {
        differenceTrend: (
          <InlineDifference isAmount={isAmount} value={differenceValue} />
        ),
        differenceAverage: (
          <InlineText fontWeight="bold">
            {formatNumber(differenceValue.old_value)}
          </InlineText>
        ),
        ...(additionalData || {}),
      })}
    </>
  );
}
