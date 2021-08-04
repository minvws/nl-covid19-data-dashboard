import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { ValueAnnotation } from '~/components/value-annotation';
import { useIntl } from '~/intl';
import { Box } from '../base';
import { SidebarDifference } from '../difference-indicator';
import { InlineText, Text } from '../typography';

type SidebarKpiValueProps = {
  title: string;
  /**
   * Make value optional for odd case where we do not show a metric.
   * Currently only `Behavior` is doing that.
   */
  value?: number;
  description?: string;
  valueAnnotation?: string;
  difference?: DifferenceDecimal | DifferenceInteger;
  isPercentage?: boolean;
};

export function SidebarKpiValue(props: SidebarKpiValueProps) {
  const {
    value,
    isPercentage,
    title,
    description,
    valueAnnotation,
    difference,
  } = props;

  const { formatPercentage, formatNumber } = useIntl();

  return (
    <Box width="100%" minHeight="4rem" spacing={2}>
      <Text>{title}</Text>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        flexWrap="wrap"
        spacingHorizontal={2}
      >
        {isDefined(value) && (
          <InlineText variant="h3">
            {isPercentage ? `${formatPercentage(value)}%` : formatNumber(value)}
          </InlineText>
        )}

        {isDefined(difference) && (
          <Box fontSize={3} display="flex" alignItems="center" marginRight={1}>
            <SidebarDifference value={difference} />
          </Box>
        )}

        {isDefined(description) && (
          <InlineText variant="label1" color="annotation" fontWeight="bold">
            {description}
          </InlineText>
        )}
      </Box>

      {valueAnnotation && <ValueAnnotation>{valueAnnotation}</ValueAnnotation>}
    </Box>
  );
}
