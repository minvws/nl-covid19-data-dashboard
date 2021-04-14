import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import styled from 'styled-components';
import { color } from 'styled-system';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { DifferenceIndicator } from '~/components/difference-indicator';
import { ValueAnnotation } from '~/components/value-annotation';
import { useIntl } from '~/intl';

interface KpiValueProps {
  absolute?: number;
  percentage?: number;
  valueAnnotation?: string;
  difference?: DifferenceDecimal | DifferenceInteger;
  differenceStaticTimespan?: string;
  text?: string;
  color?: string;
}

/**
 * When we need to style something specific there is no real reason to use the
 * box component and we can style everything directly. Only you can not access
 * theme variables from the style object, so in this case color need to be set
 * using a prop.
 */
const StyledValue = styled.div(
  {
    /**
     * This font size is only used in KPI value so left out of them array because
     * it would mess with the consecutive order of headings.
     */
    fontSize: '1.80203rem',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1,
  },
  color
);

/**
 * Display a blue KPI value with optionally a percentage behind it.
 */
export function KpiValue({
  absolute,
  percentage,
  valueAnnotation,
  difference,
  differenceStaticTimespan,
  text,
  color = 'data.primary',
  ...otherProps
}: KpiValueProps) {
  const { formatPercentage, formatNumber } = useIntl();

  return (
    <Box mb={3}>
      {isDefined(percentage) && isDefined(absolute) ? (
        <StyledValue color={color} {...otherProps}>
          {`${formatNumber(absolute)} (${formatPercentage(percentage)}%)`}
        </StyledValue>
      ) : isDefined(percentage) ? (
        <StyledValue color={color} {...otherProps}>
          {`${formatPercentage(percentage)}%`}
        </StyledValue>
      ) : isDefined(text) ? (
        <StyledValue color={color} {...otherProps}>
          {text}
        </StyledValue>
      ) : (
        <StyledValue color={color} {...otherProps}>
          {formatNumber(absolute)}
        </StyledValue>
      )}
      {difference && (
        <DifferenceIndicator
          value={difference}
          staticTimespan={differenceStaticTimespan}
        />
      )}
      {valueAnnotation && <ValueAnnotation>{valueAnnotation}</ValueAnnotation>}
    </Box>
  );
}
