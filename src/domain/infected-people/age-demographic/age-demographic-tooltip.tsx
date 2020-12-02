import css from '@styled-system/css';
import styled from 'styled-components';
import { Text } from '~/components-styled/typography';
import { formatPercentage } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import {
  AGE_GROUP_TOOLTIP_WIDTH,
  formatAgeGroupRange,
} from './age-demographic-chart';
import siteText from '~/locale/index';
import { NationalInfectedAgeGroupsValue } from '~/types/data';

const text = siteText.infected_age_groups;

interface AgeDemographicTooltipProps {
  left: number;
  top: number;
  value: NationalInfectedAgeGroupsValue;
}

const Tooltip = styled.div(
  css({
    position: 'absolute',
    background: 'white',
    transition: 'left 0.15s, top 0.15s',
    transform: 'translate(0, 20px)',
    pointerEvents: 'none',
    width: `${AGE_GROUP_TOOLTIP_WIDTH}px`,
    boxShadow: 'tile',
    borderRadius: 1,
    zIndex: 42,
  })
);

const Legend = styled.ul(
  css({
    borderTop: '1px solid',
    borderTopColor: 'lightGray',
    m: 0,
    px: 0,
    py: 2,
  })
);

const LegendItem = styled.li(
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
      backgroundColor: 'data.neutral',
      position: 'absolute',
      left: 3,
      top: '0.5rem',
    },
    '&.infected-percentage:before': {
      backgroundColor: 'data.primary',
    },
  })
);

export function AgeDemographicTooltip({
  value,
  left,
  top,
}: AgeDemographicTooltipProps) {
  return (
    <Tooltip style={{ left, top }}>
      <Text fontSize={3} fontWeight="bold" px={3} py={2} m="0">
        {replaceVariablesInText(text.graph.age_group_range_tooltip, {
          ageGroupRange: formatAgeGroupRange(value.age_group_range),
        })}
      </Text>
      <Legend>
        <LegendItem>
          <b>{formatPercentage(value.age_group_percentage * 100)}%</b>{' '}
          {replaceVariablesInText(text.graph.age_group_percentage_tooltip, {
            ageGroupRange: formatAgeGroupRange(value.age_group_range),
          })}
        </LegendItem>
        <LegendItem className="infected-percentage">
          <b>{formatPercentage(value.infected_percentage * 100)}%</b>{' '}
          {replaceVariablesInText(text.graph.infected_percentage_tooltip, {
            ageGroupRange: formatAgeGroupRange(value.age_group_range),
          })}
        </LegendItem>
      </Legend>
    </Tooltip>
  );
}
