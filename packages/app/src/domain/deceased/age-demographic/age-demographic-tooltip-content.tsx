import css from '@styled-system/css';
import styled from 'styled-components';
import { Text } from '~/components-styled/typography';
import siteText from '~/locale/index';
import { formatPercentage } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatAgeGroupRange } from './age-demographic-chart';
import { AgeDemographicDefaultValue } from './age-demographic-coordinates';

const text = siteText.infected_age_groups;

interface AgeDemographicTooltipContentProps<
  T extends AgeDemographicDefaultValue
> {
  value: T;
  metricProperty: keyof T;
}

export function AgeDemographicTooltipContent<
  T extends AgeDemographicDefaultValue
>({ value, metricProperty }: AgeDemographicTooltipContentProps<T>) {
  return (
    <>
      <Text fontSize={3} fontWeight="bold" px={3} py={2} m="0">
        {replaceVariablesInText(text.graph.age_group_range_tooltip, {
          ageGroupRange: formatAgeGroupRange(value.age_group_range),
        })}
      </Text>
      <Legend>
        <LegendItem color="data.neutral">
          <b>{formatPercentage(value.age_group_percentage * 100)}%</b>{' '}
          {replaceVariablesInText(text.graph.age_group_percentage_tooltip, {
            ageGroupRange: formatAgeGroupRange(value.age_group_range),
          })}
        </LegendItem>
        <LegendItem color="data.primary">
          <b>
            {formatPercentage(
              ((value[metricProperty] as unknown) as number) * 100
            )}
            %
          </b>{' '}
          {replaceVariablesInText(text.graph.infected_percentage_tooltip, {
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
