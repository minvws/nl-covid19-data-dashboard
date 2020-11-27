import css from '@styled-system/css';
import styled from 'styled-components';
import theme from '~/style/theme';

export const Menu = styled.ul(
  css({
    listStyle: 'none',
    margin: 0,
    padding: 0,
  })
);

export const CategoryMenuItem = styled.li({});

export const MetricMenuItem = styled.li(
  css({
    borderBottom: `1px solid ${theme.colors.border}`,
    '&:first-child': {
      borderTop: `1px solid ${theme.colors.border}`,
    },
  })
);
