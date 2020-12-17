import css from '@styled-system/css';
import styled from 'styled-components';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { EscalationLevel } from '~/components/restrictions/type';
import text from '~/locale/index';

const escalationThresholds =
  regionThresholds.escalation_levels.escalation_level;

export function EscalationLevelIcon({ level }: { level: EscalationLevel }) {
  const color = escalationThresholds[level - 1].color;
  return (
    <div css={css({ display: 'inline-block' })}>
      <StyledEscalationLevelIcon
        color={color}
        title={`${text.common.niveau} ${level}`}
      >
        {level}
      </StyledEscalationLevelIcon>
    </div>
  );
}

const StyledEscalationLevelIcon = styled.div<{ color: string }>(({ color }) =>
  css({
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: color,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  })
);
