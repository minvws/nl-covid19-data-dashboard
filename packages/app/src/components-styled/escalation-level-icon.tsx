import css from '@styled-system/css';
import styled from 'styled-components';
import { ResponsiveValue } from 'styled-system';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { EscalationLevel } from '~/domain/restrictions/type';
import text from '~/locale/index';
import { asResponsiveArray } from '~/style/utils';

const escalationThresholds =
  regionThresholds.escalation_levels.escalation_level;

interface EscalationLevelIconProps {
  level: EscalationLevel;
  isLarge?: boolean;
}

export function EscalationLevelIcon({
  level,
  isLarge = false,
}: EscalationLevelIconProps) {
  const color = escalationThresholds[level - 1].color;
  const size = asResponsiveArray({
    _: isLarge ? 32 : 24,
    sm: isLarge ? 45 : 32,
  });
  const fontSize = asResponsiveArray({
    _: isLarge ? 20 : 14,
    sm: isLarge ? 28 : 20,
  });
  return (
    <div css={css({ display: 'inline-block' })}>
      <StyledEscalationLevelIcon
        color={color}
        title={`${text.common.niveau} ${level}`}
        size={size}
        fontSize={fontSize}
      >
        {level}
      </StyledEscalationLevelIcon>
    </div>
  );
}

const StyledEscalationLevelIcon = styled.div<{
  color: string;
  size: number | ResponsiveValue<number>;
  fontSize: number | ResponsiveValue<number>;
}>(({ color, size, fontSize }) =>
  css({
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: color,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize,
    fontWeight: 'bold',
  })
);
