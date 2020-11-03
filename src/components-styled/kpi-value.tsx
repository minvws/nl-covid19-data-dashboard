import styled from 'styled-components';
import { color } from 'styled-system';
import { isDefined } from 'ts-is-present';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { ValueAnnotation } from '~/components-styled/value-annotation';

interface KpiValueProps {
  absolute?: number;
  percentage?: number;
  valueAnnotation?: string;
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
  ...props
}: KpiValueProps) {
  return (
    <>
      {isDefined(percentage) ? (
        <StyledValue color="blue" {...(props as any)}>
          {`${formatNumber(absolute)} (${formatPercentage(percentage)}%)`}
        </StyledValue>
      ) : (
        <StyledValue color="blue" {...(props as any)}>
          {formatNumber(absolute)}
        </StyledValue>
      )}
      {valueAnnotation && <ValueAnnotation>{valueAnnotation}</ValueAnnotation>}
    </>
  );
}
