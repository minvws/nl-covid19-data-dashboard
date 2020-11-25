import css from '@styled-system/css';
import styled from 'styled-components';
import { NationalInfectedAgeGroupsValue } from '~/types/data';
import { formatPercentage } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const formatAgeGroupRange = (range: string): string => {
  return range.split('-').join(' – ');
};

interface AgeGroupTooltipProps {
  left: number;
  top: number;
  value: NationalInfectedAgeGroupsValue;
}

export const Tooltip = styled.div(
  css({
    position: 'absolute',
    background: '#FFF',
    transition: 'left 0.15s, top 0.15s',
    p: 3,
    border: '1px solid black',
    transform: 'translate(5px, 15px)',
    pointerEvents: 'none',
    width: `300px`,
  })
);

export function AgeGroupTooltip({ value, left, top }: AgeGroupTooltipProps) {
  return (
    <Tooltip style={{ left: `${left}px`, top: `${top}px` }}>
      <h4>
        {replaceVariablesInText('{{ageGroupRange}} jaar', {
          ageGroupRange: formatAgeGroupRange(value.age_group_range),
        })}
      </h4>
      <p>
        <b>{formatPercentage(value.age_group_percentage)}%</b>{' '}
        {replaceVariablesInText('van de bevolking is {{ageGroupRange}} jaar', {
          ageGroupRange: formatAgeGroupRange(value.age_group_range),
        })}
      </p>
      <p>
        <b>{formatPercentage(value.infected_percentage)}%</b>{' '}
        {replaceVariablesInText(
          'van het aantal positief geteste mensen is {{ageGroupRange}} jaar',
          {
            ageGroupRange: formatAgeGroupRange(value.age_group_range),
          }
        )}
      </p>
    </Tooltip>
  );
}
