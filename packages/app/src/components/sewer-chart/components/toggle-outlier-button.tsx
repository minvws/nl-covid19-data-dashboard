import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { InlineText } from '~/components/typography';

const BACKGROUND_COLOR = 'rgba(218, 218, 218, 0.2)';
const BACKGROUND_COLOR_HOVER = 'rgba(218, 218, 218, 0.3)';

interface ToggleOutlierButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled: boolean;
}

export function ToggleOutlierButton({
  children,
  onClick,
  disabled,
}: ToggleOutlierButtonProps) {
  return (
    <StyledToggleOutlierButton onClick={onClick} disabled={disabled}>
      <InlineText>{children}</InlineText>
    </StyledToggleOutlierButton>
  );
}

export const StyledToggleOutlierButton = styled.button(
  css({
    border: 0,
    p: 1,
    color: 'blue',
    width: '100%',
    cursor: 'pointer',
    height: '26px',
    fontSize: 1,
    zIndex: 10,
    position: 'relative',

    bg: BACKGROUND_COLOR,
    [InlineText]: { bg: hexify(BACKGROUND_COLOR) },

    '&:hover:not([disabled])': {
      bg: BACKGROUND_COLOR_HOVER,
      [InlineText]: { bg: hexify(BACKGROUND_COLOR_HOVER) },
    },

    ':disabled': {
      color: 'border',
      cursor: 'default',
    },
  })
);

/**
 * transform rgba with transparency to its hex alternative on a white background.
 * https://stackoverflow.com/questions/15898740/how-to-convert-rgba-to-a-transparency-adjusted-hex
 */
function hexify(color: string) {
  const values = color
    .replace(/rgba?\(/, '')
    .replace(/\)/, '')
    .replace(/[\s+]/g, '')
    .split(',');
  const a = parseFloat(values[3] || '1'),
    r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
    g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
    b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);

  return (
    '#' +
    ('0' + r.toString(16)).slice(-2) +
    ('0' + g.toString(16)).slice(-2) +
    ('0' + b.toString(16)).slice(-2)
  );
}
