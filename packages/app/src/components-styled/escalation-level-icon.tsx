import css from '@styled-system/css';
import styled from 'styled-components';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { EscalationLevel } from '~/domain/restrictions/type';
import { asResponsiveArray } from '~/style/utils';
import { useIntl } from '~/intl';

const escalationThresholds = regionThresholds.escalation_levels.level;

interface EscalationLevelIconProps {
  level: EscalationLevel;
  isSmall?: boolean;
}

export function EscalationLevelIcon({
  level,
  isSmall,
}: EscalationLevelIconProps) {
  /* Colors are in a 0-indexed array */
  const color = escalationThresholds[level - 1].color;

  const { siteText } = useIntl();

  return (
    <div css={css({ display: 'inline-block' })}>
      <StyledEscalationLevelIcon
        color={color}
        title={`${siteText.common.niveau} ${level}`}
        isSmall={isSmall}
      >
        {level}
      </StyledEscalationLevelIcon>
    </div>
  );
}

const StyledEscalationLevelIcon = styled.div<{
  color: string;
  isSmall?: boolean;
}>(({ color, isSmall }) => {
  const size = isSmall
    ? asResponsiveArray({ _: 20, sm: 20 })
    : asResponsiveArray({ _: 24, sm: 22 });
  return css({
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: color,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isSmall ? 14 : asResponsiveArray({ _: 14, sm: 18 }),
    fontWeight: 'bold',
  });
});
