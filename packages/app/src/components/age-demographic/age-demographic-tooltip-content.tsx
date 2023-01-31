import { Color, colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import { BoldText } from '~/components/typography';
import { space } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { Box } from '../base';
import { AgeDemographicChartText, AgeDemographicDefaultValue } from './types';
import { formatAgeGroupRange } from './utils';

interface AgeDemographicTooltipContentProps<T extends AgeDemographicDefaultValue> {
  value: T;
  rightMetricProperty: keyof T;
  leftMetricProperty: keyof T;
  rightColor: Color | string;
  leftColor: Color | string;
  text: AgeDemographicChartText;
  formatValue: (n: number) => string;
}

export function AgeDemographicTooltipContent<T extends AgeDemographicDefaultValue>({
  value,
  rightMetricProperty,
  leftMetricProperty,
  rightColor,
  leftColor,
  text,
  formatValue,
}: AgeDemographicTooltipContentProps<T>) {
  const valueRight = value[rightMetricProperty];
  const rightMetricPropertyValue = typeof valueRight === 'number' ? valueRight : 0;

  const valueLeft = value[leftMetricProperty];
  const leftMetricPropertyValue = typeof valueLeft === 'number' ? valueLeft : 0;

  return (
    <>
      <Box paddingX={space[3]} paddingY={space[2]}>
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

const Legend = styled.ul`
  border-top: 1px solid ${colors.gray2};
  margin: 0;
  padding: ${space[2]} 0;
`;

interface LegendItemProps {
  color: string;
}

const LegendItem = styled.li<LegendItemProps>`
  list-style: none;
  margin: 0;
  padding: ${space[1]} ${space[3]} ${space[1]} 2.75rem;
  position: relative;

  &:before {
    background-color: ${({ color }) => color};
    content: '';
    display: block;
    height: ${space[3]};
    left: ${space[3]};
    position: absolute;
    top: ${space[2]};
    width: ${space[3]};
  }
`;
