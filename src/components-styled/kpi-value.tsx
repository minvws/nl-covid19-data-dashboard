// import styled from 'styled-components';
// import { color } from 'styled-system';
import { isDefined } from 'ts-is-present';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { Box } from './base';

// const Root = styled.span(color);

interface KpiValueProps {
  absolute: number;
  percentage?: number;
}

/**
 * Display a blue KPI value with optionally a percentage behind it.
 */
export function KpiValue({ absolute, percentage }: KpiValueProps) {
  if (isDefined(percentage)) {
    return (
      <Box as="span" color="blue">
        {`${formatNumber(absolute)} (${formatPercentage(percentage)}%)`}
      </Box>
    );
  } else {
    return (
      <Box as="span" color="blue">
        {formatNumber(absolute)}
      </Box>
    );
  }
}
