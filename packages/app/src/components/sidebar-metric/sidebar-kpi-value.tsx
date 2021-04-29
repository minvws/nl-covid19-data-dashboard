import { isDefined } from 'ts-is-present';
import { ValueAnnotation } from '~/components/value-annotation';
import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import { Box } from '../base';
import { DifferenceIndicator } from '../difference-indicator';
import { Heading, InlineText } from '../typography';
import { useIntl } from '~/intl';

type SidebarKpiValueProps = {
  title: string;
  /**
   * Make value optional for odd case where we do not show a metric.
   * Currently only `Behavior` is doing that.
   */
  value?: number;
  description: string;
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
    <Box width="100%" minHeight="4rem">
      <Heading level={4} fontSize={2} fontWeight="normal" m={0} as="div">
        {title}
      </Heading>
      <Box display="flex" alignItems="center" justifyContent="flex-start">
        {isDefined(value) && (
          <InlineText
            fontSize={3}
            fontWeight="bold"
            margin="0"
            marginRight={isDefined(difference) ? 1 : 3}
          >
            {isPercentage ? `${formatPercentage(value)}%` : formatNumber(value)}
          </InlineText>
        )}

        {isDefined(difference) && (
          <Box fontSize={3} display="flex" alignItems="center" marginRight={1}>
            <DifferenceIndicator value={difference} context="sidebar" />
          </Box>
        )}

        <InlineText
          display="inline-block"
          margin="0"
          color="annotation"
          fontSize={1}
        >
          {description}
        </InlineText>
      </Box>

      {valueAnnotation && <ValueAnnotation>{valueAnnotation}</ValueAnnotation>}
    </Box>
  );
}
