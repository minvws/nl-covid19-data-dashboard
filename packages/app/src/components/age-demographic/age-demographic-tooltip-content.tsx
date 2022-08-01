import type { Color } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { BoldText } from '~/components/typography';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { Box } from '../base';
import { AgeDemographicChartText, AgeDemographicDefaultValue } from './types';
import { formatAgeGroupRange } from './utils';

interface AgeDemographicTooltipContentProps<
  T extends AgeDemographicDefaultValue
> {
  value: T;
  rightMetricProperty: keyof T;
  leftMetricProperty: keyof T;
  rightColor: Color;
  leftColor: Color;
  text: AgeDemographicChartText;
  formatValue: (n: number) => string;
}

export function AgeDemographicTooltipContent<
  T extends AgeDemographicDefaultValue
>({
  value,
  rightMetricProperty,
  leftMetricProperty,
  rightColor,
  leftColor,
  text,
  formatValue,
}: AgeDemographicTooltipContentProps<T>) {
  const valueRight = value[rightMetricProperty];
  const rightMetricPropertyValue =
    typeof valueRight === 'number' ? valueRight : 0;

  const valueLeft = value[leftMetricProperty];
  const leftMetricPropertyValue = typeof valueLeft === 'number' ? valueLeft : 0;

  return (
    <>
      <Box px={3} py={2}>
        <BoldText variant="h3">
          {replaceVariablesInText(text.age_group_range_tooltip, {
            ageGroupRange: formatAgeGroupRange(value.age_group_range),
          })}
        </BoldText>
      </Box>
      <Legend>
        <LegendItem color={rightColor}>
          <BoldText>{formatValue(rightMetricPropertyValue)}</BoldText>{' '}
          {replaceVariablesInText(text.right_tooltip, {
            ageGroupRange: formatAgeGroupRange(value.age_group_range),
          })}
        </LegendItem>
        <LegendItem color={leftColor}>
          <BoldText>{formatValue(leftMetricPropertyValue)}</BoldText>{' '}
          {replaceVariablesInText(text.left_tooltip, {
            ageGroupRange: formatAgeGroupRange(value.age_group_range),
          })}
        </LegendItem>
      </Legend>
    </>
  );
}

const Legend = styled.ul(
  css({
    borderTop: '1px solid',
    borderTopColor: 'lightGray',
    m: 0,
    px: 0,
    py: 2,
  })
);

const LegendItem = styled.li<{ color: string }>((x) =>
  css({
    listStyle: 'none',
    m: 0,
    pl: '2.75rem',
    pr: 3,
    py: 1,
    position: 'relative',
    '&:before': {
      content: '""',
      display: 'block',
      width: '1rem',
      height: '1rem',
      backgroundColor: x.color,
      position: 'absolute',
      left: 3,
      top: '0.5rem',
    },
  })
);
