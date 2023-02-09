import { DifferenceDecimal, DifferenceInteger } from '@corona-dashboard/common';
import styled from 'styled-components';
import { color } from 'styled-system';
import { isDefined, isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { TileAverageDifference, TileDifference } from '~/components/difference-indicator';
import { ValueAnnotation } from '~/components/value-annotation';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';

interface KpiValueBaseProps {
  absolute?: number | null;
  percentage?: number | null;
  valueAnnotation?: string;
  text?: string;
  color?: string;
  isMovingAverageDifference?: boolean;
  differenceFractionDigits?: number;
  numFractionDigits?: number;
}

type DifferenceProps =
  | {
      difference?: never;
      isAmount?: boolean;
    }
  | {
      difference: DifferenceDecimal | DifferenceInteger;
      isAmount: boolean;
    };

type KpiValueProps = KpiValueBaseProps & DifferenceProps;

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
  text,
  color = 'primary',
  isMovingAverageDifference,
  isAmount,
  differenceFractionDigits,
  numFractionDigits,
  ...otherProps
}: KpiValueProps) {
  const { formatPercentage, formatNumber } = useIntl();

  return (
    <Box marginBottom={isDefined(difference) ? space[3] : 0}>
      {isPresent(percentage) && isPresent(absolute) ? (
        <StyledValue color={color} {...otherProps}>
          {`${formatNumber(absolute)} (${formatPercentage(percentage, {
            minimumFractionDigits: numFractionDigits,
            maximumFractionDigits: numFractionDigits,
          })}%)`}
        </StyledValue>
      ) : isPresent(percentage) ? (
        <StyledValue color={color} {...otherProps}>
          {`${formatPercentage(percentage, {
            minimumFractionDigits: numFractionDigits,
            maximumFractionDigits: numFractionDigits,
          })}%`}
        </StyledValue>
      ) : isDefined(text) ? (
        <StyledValue color={color} {...otherProps}>
          {text}
        </StyledValue>
      ) : isPresent(absolute) ? (
        <StyledValue color={color} {...otherProps}>
          {formatNumber(absolute, numFractionDigits)}
        </StyledValue>
      ) : (
        <StyledValue color={color} {...otherProps}>
          –
        </StyledValue>
      )}

      {isDefined(difference) &&
        isDefined(isAmount) &&
        (isMovingAverageDifference ? (
          <Box paddingTop={space[2]}>
            <TileAverageDifference
              value={difference}
              isPercentage={isDefined(percentage) && !isDefined(absolute)}
              isAmount={isAmount}
              maximumFractionDigits={differenceFractionDigits}
            />
          </Box>
        ) : isDefined(difference) ? (
          <Box paddingTop={space[2]}>
            <TileDifference value={difference} isPercentage={isDefined(percentage) && !isDefined(absolute)} isAmount={isAmount} maximumFractionDigits={differenceFractionDigits} />
          </Box>
        ) : null)}
      {valueAnnotation && <ValueAnnotation>{valueAnnotation}</ValueAnnotation>}
    </Box>
  );
}
