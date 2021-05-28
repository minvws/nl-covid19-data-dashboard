import css from '@styled-system/css';
import styled from 'styled-components';
import { EscalationLevel } from '~/domain/restrictions/type';
import { asResponsiveArray } from '~/style/utils';
import { useIntl } from '~/intl';
import { VisuallyHidden } from './visually-hidden';
import { useEscalationColor } from '~/utils/use-escalation-color';

export type SizeVariants = 'small' | 'medium' | 'large';

interface EscalationLevelIconProps {
  level: EscalationLevel;
  size?: SizeVariants;
}

export function EscalationLevelIcon({
  level,
  size = 'medium',
}: EscalationLevelIconProps) {
  const color = useEscalationColor(level);
  const intl = useIntl();

  return (
    <div css={css({ display: 'inline-block' })}>
      <StyledEscalationLevelIcon color={color} size={size}>
        <VisuallyHidden>
          {intl.siteText.common.risiconiveau_singular}
        </VisuallyHidden>{' '}
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
