import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import theme from '~/style/theme';

const StyledMenu = styled.ul(
  css({
    listStyle: 'none',
    margin: 0,
    padding: 0,
  })
);

export const Menu = ({ children }: { children: ReactNode }) => {
  return <StyledMenu role="menu">{children}</StyledMenu>;
};

export const CategoryMenuItem = styled.li(
  css({
    '& p': {
      mt: 4,
    },
  })
);

export const MetricMenuItem = styled.li(
  css({
    borderBottom: `1px solid ${theme.colors.border}`,
    '&:first-child': {
      borderTop: `1px solid ${theme.colors.border}`,
    },
  })
);
