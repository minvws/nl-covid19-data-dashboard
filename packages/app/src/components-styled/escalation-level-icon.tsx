import css from '@styled-system/css';
import styled from 'styled-components';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { EscalationLevel } from '~/domain/restrictions/type';
import text from '~/locale/index';
import { asResponsiveArray } from '~/style/utils';

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
    width: asResponsiveArray({ _: 24, sm: 32 }),
    height: asResponsiveArray({ _: 24, sm: 32 }),
    borderRadius: '50%',
    backgroundColor: color,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: asResponsiveArray({ _: 14, sm: 20 }),
    fontWeight: 'bold',
  })
);
