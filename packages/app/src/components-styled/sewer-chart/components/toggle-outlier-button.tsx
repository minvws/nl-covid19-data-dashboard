import css from '@styled-system/css';
import styled from 'styled-components';

export const ToggleOutlierButton = styled.button(
  css({
    bg: 'transparent',
    border: 0,
    p: 1,
    color: 'blue',
    width: '100%',
    cursor: 'pointer',
    height: '26px',
    fontSize: 1,
    '&:hover:not([disabled])': { bg: 'rgba(218, 218, 218, 0.3)' },

    ':disabled': {
      color: 'border',
      cursor: 'default',
    },
  })
);
