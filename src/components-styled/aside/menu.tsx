import css from '@styled-system/css';
import styled from 'styled-components';
import { borders, BordersProps } from 'styled-system';

export const Menu = styled.ul(
  css({
    listStyle: 'none',
    margin: 0,
    padding: 0,
  })
);

export const CategoryMenuItem = styled.li<BordersProps>(borders);

export const MetricMenuItem = styled.li(
  css({
    borderBottom: '1px solid',
    borderBottomColor: 'border',
    '&:first-child': {
      borderTop: '1px solid',
      borderTopColor: 'border',
    },
  })
);
