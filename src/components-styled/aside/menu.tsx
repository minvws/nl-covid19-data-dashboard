import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import theme from '~/style/theme';

type WithChildren = {
  children: ReactNode;
};

const StyledMenu = styled.ul(
  css({
    listStyle: 'none',
    margin: 0,
    padding: 0,
  })
);

export const Menu = ({
  children,
  ariaLabel,
}: WithChildren & { ariaLabel?: string }) => {
  return (
    <StyledMenu role="menu" aria-label={ariaLabel}>
      {children}
    </StyledMenu>
  );
};

const StyledCategoryMenuItem = styled.li(
  css({
    '& p': {
      mt: 4,
    },
  })
);

export const CategoryMenuItem = ({ children }: WithChildren) => {
  return (
    <StyledCategoryMenuItem role="none">{children}</StyledCategoryMenuItem>
  );
};

export const StyledMetricMenuItem = styled.li(
  css({
    borderBottom: `1px solid ${theme.colors.border}`,
    '&:first-child': {
      borderTop: `1px solid ${theme.colors.border}`,
    },
  })
);

export const MetricMenuItem = ({ children }: WithChildren) => {
  return <StyledMetricMenuItem role="none">{children}</StyledMetricMenuItem>;
};
