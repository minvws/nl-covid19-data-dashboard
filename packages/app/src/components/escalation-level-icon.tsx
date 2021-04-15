import css from '@styled-system/css';
import styled from 'styled-components';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { EscalationLevel } from '~/domain/restrictions/type';
import { asResponsiveArray } from '~/style/utils';
import { useIntl } from '~/intl';

const escalationThresholds = regionThresholds.escalation_levels.level;

export type SizeVariants = 'small' | 'medium' | 'large';

interface EscalationLevelIconProps {
  level: EscalationLevel;
  size?: SizeVariants;
}

export function EscalationLevelIcon({
  level,
  size = 'medium',
}: EscalationLevelIconProps) {
  /* Colors are in a 0-indexed array */
  const color = escalationThresholds[level - 1].color;

  const { siteText } = useIntl();

  return (
    <div css={css({ display: 'inline-block' })}>
      <StyledEscalationLevelIcon
        color={color}
        title={`${siteText.common.niveau} ${level}`}
        size={size}
      >
        {level}
      </StyledEscalationLevelIcon>
    </div>
  );
}

const StyledEscalationLevelIcon = styled.div<{
  color: string;
  size?: SizeVariants;
}>(({ color, size }) => {
  let sizeDimensions = 24;
  if (size === 'small') sizeDimensions = 22;
  if (size === 'large') sizeDimensions = 45;

  return css({
    width: sizeDimensions,
    height: sizeDimensions,
    borderRadius: '50%',
    backgroundColor: color,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize:
      size === 'small' || size === 'large'
        ? size === 'small'
          ? 14 // small
          : 28 // big
        : asResponsiveArray({ _: 14, sm: 18 }), // default
    fontWeight: 'bold',
    lineHeight: 'normal',
  });
});
