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
  size?: 'small' | 'normal';
}

export function EscalationLevelIcon({
  level,
  size = 'normal',
}: EscalationLevelIconProps) {
  const color = escalationThresholds[level - 1].color;
  const outerDimension = getOuterDimension(size);
  const fontSize = getFontSize(size);

  return (
    <div css={css({ display: 'inline-block' })}>
      <StyledEscalationLevelIcon
        color={color}
        title={`${text.common.niveau} ${level}`}
        outerDimension={outerDimension}
        fontSize={fontSize}
      >
        {level}
      </StyledEscalationLevelIcon>
    </div>
  );
}

const StyledEscalationLevelIcon = styled.div<{
  color: string;
  outerDimension: number | ResponsiveValue<number>;
  fontSize: number | ResponsiveValue<number>;
}>(({ color, outerDimension, fontSize }) =>
  css({
    width: outerDimension,
    height: outerDimension,
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

function getOuterDimension(size: 'small' | 'normal') {
  if (size === 'small') {
    return asResponsiveArray({ _: 20, sm: 20 });
  }
  return asResponsiveArray({ _: 24, sm: 32 });
}

function getFontSize(size: 'small' | 'normal') {
  if (size === 'small') {
    return 14;
  }
  return asResponsiveArray({ _: 14, sm: 20 });
}
