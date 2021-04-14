import css from '@styled-system/css';
import styled from 'styled-components';
import { Text } from '~/components/typography';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { AgeDemographicChartText, AgeDemographicDefaultValue } from './types';
import { formatAgeGroupRange } from './utils';
import { useIntl } from '~/intl';

interface AgeDemographicTooltipContentProps<
  T extends AgeDemographicDefaultValue
> {
  value: T;
  metricProperty: keyof T;
  text: AgeDemographicChartText;
}

export function AgeDemographicTooltipContent<
  T extends AgeDemographicDefaultValue
>({ value, metricProperty, text }: AgeDemographicTooltipContentProps<T>) {
  const { formatPercentage } = useIntl();

  return (
    <>
      <Text fontSize={3} fontWeight="bold" px={3} py={2} m="0">
        {replaceVariablesInText(text.age_group_range_tooltip, {
          ageGroupRange: formatAgeGroupRange(value.age_group_range),
        })}
      </Text>
      <Legend>
        <LegendItem color="data.primary">
          <b>
            {formatPercentage(
              ((value[metricProperty] as unknown) as number) * 100
            )}
            %
          </b>{' '}
          {replaceVariablesInText(text.value_percentage_tooltip, {
            ageGroupRange: formatAgeGroupRange(value.age_group_range),
          })}
        </LegendItem>
        <LegendItem color="data.neutral">
          <b>{formatPercentage(value.age_group_percentage * 100)}%</b>{' '}
          {replaceVariablesInText(text.age_group_percentage_tooltip, {
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
