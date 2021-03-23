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
  isBig?: boolean;
}

export function EscalationLevelIcon({
  level,
  isSmall,
  isBig,
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
        isBig={isBig}
      >
        {level}
      </StyledEscalationLevelIcon>
    </div>
  );
}

const StyledEscalationLevelIcon = styled.div<{
  color: string;
  isSmall?: boolean;
  isBig?: boolean;
}>(({ color, isSmall, isBig }) => {
  let size = asResponsiveArray({ _: 24, sm: 22 });
  if (isSmall) size = asResponsiveArray({ _: 20, sm: 20 });
  if (isBig) size = asResponsiveArray({ _: 45, sm: 45 });

  return css({
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: color,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize:
      isSmall || isBig
        ? isSmall
          ? 14 // small
          : 28 // big
        : asResponsiveArray({ _: 14, sm: 18 }), // default
    fontWeight: 'bold',
    lineHeight: 'normal',
  });
});
