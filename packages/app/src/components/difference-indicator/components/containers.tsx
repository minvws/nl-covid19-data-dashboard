import css from '@styled-system/css';
import styled from 'styled-components';

export const IconContainer = styled.span(
  css({
    svg: {
      mr: 1,
      width: '19px',
      height: '19px',
    },
  })
);

export const Container = styled.span(
  css({
    display: 'inline-block',
    fontSize: 2,
    svg: {
      mr: 1,
      width: '1.2em',
      verticalAlign: 'text-bottom',
    },
  })
);
